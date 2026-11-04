import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useMemo, useState } from 'react';
import type { ResponseGraphFilterValue } from './responseGraphFilterTypes';

type ResponseThroughputAnalyticsChartProps = {
  filterValue: ResponseGraphFilterValue;
  rangeStartInput: string;
  rangeEndInput: string;
};

type ResponseExportRow = {
  submittedAtIso: string;
};

type ThroughputRow = {
  label: string;
  value: number;
};

const CHART_HEIGHT_PX = 320;
const CHART_MIN_WIDTH_PX = 980;
const CHART_MIN_WIDTH_PER_CATEGORY_PX = 56;

function parseDateInput(value: string): Date | null {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return null;
  }
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

function resolveDayRange(startInput: string, endInput: string): { start: Date; end: Date } | null {
  const start = parseDateInput(startInput);
  const end = parseDateInput(endInput);
  if (!start || !end) {
    return null;
  }
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  if (start.getTime() > end.getTime()) {
    return null;
  }
  return { start, end };
}

function formatDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildDailyThroughputRows({
  rows,
  start,
  end,
}: {
  rows: ResponseExportRow[];
  start: Date;
  end: Date;
}): ThroughputRow[] {
  const countsByDay = new Map<string, number>();
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    countsByDay.set(formatDayKey(cursor), 0);
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const row of rows) {
    const date = new Date(row.submittedAtIso);
    const dayKey = formatDayKey(date);
    if (countsByDay.has(dayKey)) {
      countsByDay.set(dayKey, (countsByDay.get(dayKey) ?? 0) + 1);
    }
  }

  return [...countsByDay.entries()].map(([label, value]) => ({ label, value }));
}

export default function ResponseThroughputAnalyticsChart({
  filterValue,
  rangeStartInput,
  rangeEndInput,
}: ResponseThroughputAnalyticsChartProps) {
  const [rows, setRows] = useState<ResponseExportRow[]>([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [hasRowsError, setHasRowsError] = useState(false);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!filterValue.rubricId || !backendUrl) {
      setRows([]);
      setHasRowsError(!backendUrl && Boolean(filterValue.rubricId));
      setIsLoadingRows(false);
      return;
    }

    let isMounted = true;
    setIsLoadingRows(true);
    setHasRowsError(false);

    const executeFetchRows = async () => {
      try {
        const query = new URLSearchParams({
          rubricId: filterValue.rubricId,
          sectionKey: filterValue.sectionKey,
          scaleId: filterValue.scaleId,
          format: 'json',
        });
        if (filterValue.rubricVersionIds.length > 0) {
          query.set('rubricVersionIds', filterValue.rubricVersionIds.join(','));
        }
        if (filterValue.responseContextKeys !== null) {
          if (filterValue.responseContextKeys.length === 0) {
            query.set('responseContextKeys', '');
          } else {
            query.set('responseContextKeys', filterValue.responseContextKeys.join(','));
          }
        }
        const response = await fetch(`${backendUrl}/rubrics/response-export?${query.toString()}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (isMounted) {
            setHasRowsError(true);
          }
          return;
        }
        const payload = (await response.json()) as ResponseExportRow[];
        if (isMounted) {
          setRows(payload);
        }
      } catch {
        if (isMounted) {
          setHasRowsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRows(false);
        }
      }
    };

    executeFetchRows();
    return () => {
      isMounted = false;
    };
  }, [
    filterValue.rubricId,
    filterValue.sectionKey,
    filterValue.scaleId,
    [...filterValue.rubricVersionIds].sort().join(','),
    filterValue.responseContextKeys === null
      ? 'all'
      : filterValue.responseContextKeys.length === 0
        ? 'none'
        : [...filterValue.responseContextKeys].sort().join(','),
  ]);

  const dayRange = useMemo(
    () => resolveDayRange(rangeStartInput, rangeEndInput),
    [rangeStartInput, rangeEndInput]
  );

  const throughputRows = useMemo(() => {
    if (!dayRange) {
      return [];
    }
    return buildDailyThroughputRows({ rows, start: dayRange.start, end: dayRange.end });
  }, [dayRange, rows]);

  const chartWidth = Math.max(
    CHART_MIN_WIDTH_PX,
    throughputRows.length * CHART_MIN_WIDTH_PER_CATEGORY_PX
  );

  if (!filterValue.rubricId) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Select a rubric to load response analytics.
      </Alert>
    );
  }

  if (isLoadingRows) {
    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 2 }}>
        <CircularProgress size={22} />
        <Typography variant="body2" color="text.secondary">
          Loading response analytics…
        </Typography>
      </Stack>
    );
  }

  if (hasRowsError) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        Could not load response analytics for the selected filters.
      </Alert>
    );
  }

  if (!dayRange) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        Enter a valid date range to view throughput.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: chartWidth, minWidth: chartWidth, maxWidth: 'none' }}>
      <BarChart
        dataset={throughputRows}
        xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
        yAxis={[{ label: 'Responses' }]}
        series={[{ type: 'bar', dataKey: 'value', label: 'Responses' }]}
        width={chartWidth}
        height={CHART_HEIGHT_PX}
        sx={{ width: chartWidth }}
        margin={{ left: 48, right: 16, top: 8, bottom: 36 }}
      />
    </Box>
  );
}
