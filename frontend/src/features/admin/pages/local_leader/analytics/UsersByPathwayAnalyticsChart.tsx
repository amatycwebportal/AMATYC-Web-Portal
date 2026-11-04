import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';
import { PATHWAYS } from '@shared/pathways';
import type { AssignmentMatrixEntry } from '@shared/types';
import { useFetchAssignmentMatrix } from '@utils/hooks/rubrics/useFetchAssignmentMatrix';

type UsersByPathwayAnalyticsChartProps = {
  variant: 'playground' | 'carousel';
};

type PathwayBucket = {
  label: string;
  value: number;
};

const PLAYGROUND_HEIGHT_PX = 340;
const CAROUSEL_HEIGHT_PX = 140;
const PLAYGROUND_MIN_WIDTH_PX = 980;
const PLAYGROUND_MIN_WIDTH_PER_CATEGORY_PX = 96;
const PATHWAY_TICK_LABEL_MAX_LENGTH = 18;

function formatPathwayTickLabel(label: string): string {
  if (label.length <= PATHWAY_TICK_LABEL_MAX_LENGTH) {
    return label;
  }
  return `${label.slice(0, PATHWAY_TICK_LABEL_MAX_LENGTH - 1)}…`;
}

function buildUsersByPathwayBuckets(assignments: AssignmentMatrixEntry[]): PathwayBucket[] {
  const userIdsByPathwayId = new Map<string, Set<string>>();

  for (const assignment of assignments) {
    const existing = userIdsByPathwayId.get(assignment.pathwayId) ?? new Set<string>();
    existing.add(assignment.userId);
    userIdsByPathwayId.set(assignment.pathwayId, existing);
  }

  return PATHWAYS.map((pathway) => ({
    label: pathway.name,
    value: userIdsByPathwayId.get(pathway.id)?.size ?? 0,
  }));
}

export default function UsersByPathwayAnalyticsChart({
  variant,
}: UsersByPathwayAnalyticsChartProps) {
  const { matrix, isLoadingMatrix, hasMatrixError } = useFetchAssignmentMatrix();

  const usersByPathwayBuckets = useMemo(
    () => buildUsersByPathwayBuckets(matrix?.assignments ?? []),
    [matrix?.assignments]
  );

  const isLoading = isLoadingMatrix;
  const hasError = hasMatrixError;
  const hasAnyUsers = usersByPathwayBuckets.some((bucket) => bucket.value > 0);
  const heightPx = variant === 'playground' ? PLAYGROUND_HEIGHT_PX : CAROUSEL_HEIGHT_PX;
  const chartWidthPx = Math.max(
    PLAYGROUND_MIN_WIDTH_PX,
    usersByPathwayBuckets.length * PLAYGROUND_MIN_WIDTH_PER_CATEGORY_PX
  );

  if (isLoading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading users by pathway…
        </Typography>
      </Stack>
    );
  }

  if (hasError) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        Could not load users by pathway.
      </Alert>
    );
  }

  if (!hasAnyUsers) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
        No rubric assignments by pathway yet
      </Typography>
    );
  }

  if (variant === 'playground') {
    return (
      <Box sx={{ width: chartWidthPx, minWidth: chartWidthPx, maxWidth: 'none' }}>
        <BarChart
          dataset={usersByPathwayBuckets}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'label',
              tickLabelStyle: { fontSize: 11 },
              valueFormatter: (value) => formatPathwayTickLabel(String(value)),
            },
          ]}
          yAxis={[{ label: 'Users' }]}
          series={[{ type: 'bar', dataKey: 'value', label: 'Users' }]}
          width={chartWidthPx}
          height={heightPx}
          sx={{ width: chartWidthPx }}
          margin={{ left: 48, right: 16, top: 8, bottom: 44 }}
        />
      </Box>
    );
  }

  return (
    <BarChart
      dataset={usersByPathwayBuckets}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'label',
          tickLabelStyle: { fontSize: 11 },
          valueFormatter: (value) => formatPathwayTickLabel(String(value)),
        },
      ]}
      yAxis={[{ label: '' }]}
      series={[{ type: 'bar', dataKey: 'value', label: 'Users' }]}
      height={heightPx}
      sx={{ width: 1 }}
      margin={{ left: 32, right: 8, top: 4, bottom: 32 }}
    />
  );
}
