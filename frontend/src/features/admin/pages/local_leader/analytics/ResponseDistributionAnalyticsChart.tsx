import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import Plot from 'react-plotly.js';
import type { Rubric, RubricScale } from '@shared/types';
import {
  buildScaleHistogramBinsFromScores,
  ScaleDistributionHistogram,
  type ScaleHistogramBin,
} from '@utils/components/charting';
import {
  RESPONSE_FILTER_ALL_SCALES,
  type ResponseGraphFilterValue,
} from './responseGraphFilterTypes';

type ResponseDistributionAnalyticsChartProps = {
  rubrics: Rubric[];
  filterValue: ResponseGraphFilterValue;
  rangeStartInput: string;
  rangeEndInput: string;
};

type ResponseExportRow = {
  score: number;
  submittedAtIso: string;
  scaleVersionId: string;
  scalePrompt: string;
  scaleOrderIndex: number;
};

type DistributionDisplayMode = 'histogram' | 'boxplot' | 'statistics';

type FullscreenSection = 'histogram' | 'boxplot' | 'statistics';

type MetricStatistics = {
  metricId: string;
  metricLabel: string;
  sampleSize: number;
  mean: number;
  median: number;
  mode: number[];
  standardDeviation: number;
  outliers: number[];
  scores: number[];
};

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

function calculateQuantile(sortedValues: number[], quantile: number): number {
  if (sortedValues.length === 0) {
    return 0;
  }
  const position = (sortedValues.length - 1) * quantile;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  if (lowerIndex === upperIndex) {
    return sortedValues[lowerIndex] ?? 0;
  }
  const lowerValue = sortedValues[lowerIndex] ?? 0;
  const upperValue = sortedValues[upperIndex] ?? 0;
  const weight = position - lowerIndex;
  return lowerValue * (1 - weight) + upperValue * weight;
}

function calculateMean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function calculateMedian(sortedValues: number[]): number {
  return calculateQuantile(sortedValues, 0.5);
}

function calculateMode(values: number[]): number[] {
  if (values.length === 0) {
    return [];
  }
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const maxCount = Math.max(...counts.values());
  if (maxCount <= 1) {
    return [];
  }
  return [...counts.entries()]
    .filter(([, count]) => count === maxCount)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const mean = calculateMean(values);
  const variance =
    values.reduce((sum, value) => {
      const diff = value - mean;
      return sum + diff * diff;
    }, 0) / values.length;
  return Math.sqrt(variance);
}

function calculateOutliers(sortedValues: number[]): number[] {
  if (sortedValues.length < 4) {
    return [];
  }
  const q1 = calculateQuantile(sortedValues, 0.25);
  const q3 = calculateQuantile(sortedValues, 0.75);
  const interquartileRange = q3 - q1;
  const lowerFence = q1 - 1.5 * interquartileRange;
  const upperFence = q3 + 1.5 * interquartileRange;
  return sortedValues.filter((value) => value < lowerFence || value > upperFence);
}

function calculateMetricStatistics(
  metricId: string,
  metricLabel: string,
  scores: number[]
): MetricStatistics {
  const sortedScores = [...scores].sort((a, b) => a - b);
  return {
    metricId,
    metricLabel,
    sampleSize: scores.length,
    mean: calculateMean(scores),
    median: calculateMedian(sortedScores),
    mode: calculateMode(scores),
    standardDeviation: calculateStandardDeviation(scores),
    outliers: calculateOutliers(sortedScores),
    scores,
  };
}

function formatNumber(value: number): string {
  return value.toFixed(2);
}

function formatMode(modeValues: number[]): string {
  if (modeValues.length === 0) {
    return 'None';
  }
  return modeValues.join(', ');
}

function formatOutliers(outliers: number[]): string {
  if (outliers.length === 0) {
    return 'None';
  }
  const maxVisibleOutliers = 6;
  if (outliers.length <= maxVisibleOutliers) {
    return outliers.join(', ');
  }
  return `${outliers.slice(0, maxVisibleOutliers).join(', ')}, +${outliers.length - maxVisibleOutliers} more`;
}

function buildScaleLabelMap(rubric: Rubric): Map<string, string> {
  const scaleLabelById = new Map<string, string>();
  rubric.scales.forEach((scale) => {
    scaleLabelById.set(scale.id, scale.prompt);
  });
  return scaleLabelById;
}

function resolveMetricLabel(
  row: ResponseExportRow,
  scaleLookup: Map<string, RubricScale>,
  scaleLabelById: Map<string, string>
): string {
  const matchingScale = scaleLookup.get(row.scaleVersionId);
  if (matchingScale?.prompt) {
    return matchingScale.prompt;
  }
  return scaleLabelById.get(row.scaleVersionId) ?? row.scalePrompt;
}

const COMPACT_CHART_PLOT_HEIGHT_PX = 320;

function resolveFullscreenSingleChartPlotHeightPx(): number {
  if (typeof window === 'undefined') {
    return 520;
  }
  return Math.max(360, window.innerHeight - 160);
}

type DistributionHistogramPanelProps = {
  bins: ScaleHistogramBin[];
  chartHeightPx: number;
  toolbarAction?: ReactNode;
};

function DistributionHistogramPanel({
  bins,
  chartHeightPx,
  toolbarAction,
}: DistributionHistogramPanelProps) {
  return (
    <Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
      <Paper variant="outlined" sx={{ p: 1, flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ px: 1, pt: 0.5, pb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Histogram (All selected metrics)
          </Typography>
          {toolbarAction}
        </Stack>
        <Box sx={{ width: '100%', minWidth: 0, px: 0.5 }}>
          <ScaleDistributionHistogram
            bins={bins}
            height={chartHeightPx}
            seriesLabel="Responses"
            levelAxisLabel="Rubric level"
          />
        </Box>
      </Paper>
    </Stack>
  );
}

type DistributionBoxPlotPanelProps = {
  metricStatistics: MetricStatistics[];
  plotHeightPx: number;
  toolbarAction?: ReactNode;
};

const BOX_PLOT_LEGEND_LABEL_MAX_LENGTH = 22;
const BOX_PLOT_SERIES_COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

function resolveBoxPlotLegendLabel(metricLabel: string): string {
  if (metricLabel.length <= BOX_PLOT_LEGEND_LABEL_MAX_LENGTH) {
    return metricLabel;
  }
  return `${metricLabel.slice(0, BOX_PLOT_LEGEND_LABEL_MAX_LENGTH)}…`;
}

function DistributionBoxPlotPanel({
  metricStatistics,
  plotHeightPx,
  toolbarAction,
}: DistributionBoxPlotPanelProps) {
  const boxPlotSeries = useMemo(
    () =>
      metricStatistics.map((metric, index) => ({
        metricId: metric.metricId,
        fullLabel: metric.metricLabel,
        shortLabel: resolveBoxPlotLegendLabel(metric.metricLabel),
        color: BOX_PLOT_SERIES_COLORS[index % BOX_PLOT_SERIES_COLORS.length] ?? '#1f77b4',
        scores: metric.scores,
      })),
    [metricStatistics]
  );

  return (
    <Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
      <Paper variant="outlined" sx={{ p: 1, flex: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ px: 1, pt: 0.5, pb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Box Plot (By metric)
          </Typography>
          {toolbarAction}
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ px: 1, pb: 0.5 }}>
          {boxPlotSeries.map((series) => (
            <Tooltip key={series.metricId} title={series.fullLabel}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  px: 0.75,
                  py: 0.25,
                  maxWidth: 220,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: 0.5,
                    bgcolor: series.color,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="caption" noWrap sx={{ cursor: 'help' }}>
                  {series.shortLabel}
                </Typography>
              </Stack>
            </Tooltip>
          ))}
        </Stack>
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Plot
            data={boxPlotSeries.map((series) => ({
              type: 'box',
              y: series.scores,
              name: series.shortLabel,
              boxpoints: 'outliers' as const,
              marker: { color: series.color },
              line: { color: series.color },
              showlegend: false,
            }))}
            layout={{
              autosize: true,
              height: plotHeightPx,
              margin: { l: 48, r: 12, t: 16, b: 72 },
              yaxis: { title: { text: 'Score' } },
              showlegend: false,
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: `${plotHeightPx}px` }}
            useResizeHandler
          />
        </Box>
      </Paper>
    </Stack>
  );
}

type DistributionStatisticsTableProps = {
  overallStatistics: MetricStatistics;
  metricStatistics: MetricStatistics[];
  headerAction?: ReactNode;
};

function DistributionStatisticsTable({
  overallStatistics,
  metricStatistics,
  headerAction,
}: DistributionStatisticsTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: 'divider' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Statistics
        </Typography>
        {headerAction}
      </Stack>
      <Table size="small" aria-label="Response metric statistics">
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell align="right">N</TableCell>
            <TableCell align="right">Mean</TableCell>
            <TableCell align="right">Median</TableCell>
            <TableCell align="right">Mode</TableCell>
            <TableCell align="right">Std dev</TableCell>
            <TableCell>Outliers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell sx={{ fontWeight: 600 }}>{overallStatistics.metricLabel}</TableCell>
            <TableCell align="right">{overallStatistics.sampleSize}</TableCell>
            <TableCell align="right">{formatNumber(overallStatistics.mean)}</TableCell>
            <TableCell align="right">{formatNumber(overallStatistics.median)}</TableCell>
            <TableCell align="right">{formatMode(overallStatistics.mode)}</TableCell>
            <TableCell align="right">{formatNumber(overallStatistics.standardDeviation)}</TableCell>
            <TableCell>{formatOutliers(overallStatistics.outliers)}</TableCell>
          </TableRow>
          {metricStatistics.map((metric) => (
            <TableRow key={metric.metricId}>
              <TableCell>{metric.metricLabel}</TableCell>
              <TableCell align="right">{metric.sampleSize}</TableCell>
              <TableCell align="right">{formatNumber(metric.mean)}</TableCell>
              <TableCell align="right">{formatNumber(metric.median)}</TableCell>
              <TableCell align="right">{formatMode(metric.mode)}</TableCell>
              <TableCell align="right">{formatNumber(metric.standardDeviation)}</TableCell>
              <TableCell>{formatOutliers(metric.outliers)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function ResponseDistributionAnalyticsChart({
  rubrics,
  filterValue,
  rangeStartInput,
  rangeEndInput,
}: ResponseDistributionAnalyticsChartProps) {
  const [displayMode, setDisplayMode] = useState<DistributionDisplayMode>('histogram');
  const [fullscreenSection, setFullscreenSection] = useState<FullscreenSection | null>(null);
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
  ]);

  useEffect(() => {
    setFullscreenSection(null);
  }, [displayMode]);

  const selectedRubric = useMemo(
    () => rubrics.find((rubric) => rubric.id === filterValue.rubricId) ?? null,
    [rubrics, filterValue.rubricId]
  );

  const rowsInDateRange = useMemo(() => {
    const dayRange = resolveDayRange(rangeStartInput, rangeEndInput);
    if (!dayRange) {
      return [];
    }
    return rows.filter((row) => {
      const submittedAt = new Date(row.submittedAtIso);
      const submittedAtTime = submittedAt.getTime();
      return (
        submittedAtTime >= dayRange.start.getTime() && submittedAtTime <= dayRange.end.getTime()
      );
    });
  }, [rows, rangeEndInput, rangeStartInput]);

  const metricStatistics = useMemo(() => {
    if (!selectedRubric) {
      return [];
    }
    const scaleById = new Map(selectedRubric.scales.map((scale) => [scale.id, scale] as const));
    const scaleLabelById = buildScaleLabelMap(selectedRubric);
    const metricRows = new Map<string, { label: string; scores: number[] }>();
    for (const row of rowsInDateRange) {
      const metricId = row.scaleVersionId;
      const metricLabel = resolveMetricLabel(row, scaleById, scaleLabelById);
      const existingMetric = metricRows.get(metricId);
      if (existingMetric) {
        existingMetric.scores.push(row.score);
      } else {
        metricRows.set(metricId, { label: metricLabel, scores: [row.score] });
      }
    }
    return [...metricRows.entries()]
      .map(([metricId, metric]) => calculateMetricStatistics(metricId, metric.label, metric.scores))
      .sort((a, b) =>
        a.metricLabel.localeCompare(b.metricLabel, undefined, { sensitivity: 'base' })
      );
  }, [rowsInDateRange, selectedRubric]);

  const combinedScores = useMemo(() => rowsInDateRange.map((row) => row.score), [rowsInDateRange]);

  const overallStatistics = useMemo(
    () => calculateMetricStatistics('all-metrics', 'All selected metrics', combinedScores),
    [combinedScores]
  );

  const levelDescriptionsForHistogram = useMemo(() => {
    if (!selectedRubric || filterValue.scaleId === RESPONSE_FILTER_ALL_SCALES) {
      return null;
    }
    return (
      selectedRubric.scales.find((scale) => scale.id === filterValue.scaleId)?.levelDescriptions ??
      null
    );
  }, [filterValue.scaleId, selectedRubric]);

  const scoreDistributionBins = useMemo(
    () =>
      buildScaleHistogramBinsFromScores(combinedScores, {
        levelDescriptions: levelDescriptionsForHistogram,
      }),
    [combinedScores, levelDescriptionsForHistogram]
  );

  const executeCloseFullscreen = useCallback(() => {
    setFullscreenSection(null);
  }, []);

  const fullscreenSingleChartPlotHeightPx = useMemo(
    () => resolveFullscreenSingleChartPlotHeightPx(),
    [fullscreenSection]
  );

  const handleDisplayModeChange = useCallback(
    (_: SyntheticEvent, nextMode: DistributionDisplayMode | null) => {
      if (nextMode !== null) {
        setDisplayMode(nextMode);
      }
    },
    []
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

  if (rowsInDateRange.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 1 }}>
        No submitted responses match the selected filters and date range.
      </Alert>
    );
  }

  const showHistogram = displayMode === 'histogram';
  const showBoxPlot = displayMode === 'boxplot';
  const showStatisticsTable = displayMode === 'statistics';

  const histogramFullscreenButton = (
    <Tooltip title="Full screen histogram">
      <IconButton
        size="small"
        aria-label="Open histogram full screen"
        onClick={() => setFullscreenSection('histogram')}
      >
        <FullscreenIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const boxPlotFullscreenButton = (
    <Tooltip title="Full screen box plot">
      <IconButton
        size="small"
        aria-label="Open box plot full screen"
        onClick={() => setFullscreenSection('boxplot')}
      >
        <FullscreenIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const statisticsFullscreenButton = (
    <Tooltip title="Full screen statistics table">
      <IconButton
        size="small"
        aria-label="Open statistics table full screen"
        onClick={() => setFullscreenSection('statistics')}
      >
        <FullscreenIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
          View
        </Typography>
        <ToggleButtonGroup
          value={displayMode}
          exclusive
          onChange={handleDisplayModeChange}
          size="small"
          color="primary"
          aria-label="Score distribution view"
        >
          <ToggleButton value="histogram" aria-label="Show histogram only">
            Histogram
          </ToggleButton>
          <ToggleButton value="boxplot" aria-label="Show box plot only">
            Box plot
          </ToggleButton>
          <ToggleButton value="statistics" aria-label="Show statistics table only">
            Statistics
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {showHistogram && (
        <DistributionHistogramPanel
          bins={scoreDistributionBins}
          chartHeightPx={COMPACT_CHART_PLOT_HEIGHT_PX}
          toolbarAction={histogramFullscreenButton}
        />
      )}

      {showBoxPlot && (
        <DistributionBoxPlotPanel
          metricStatistics={metricStatistics}
          plotHeightPx={COMPACT_CHART_PLOT_HEIGHT_PX}
          toolbarAction={boxPlotFullscreenButton}
        />
      )}

      {showStatisticsTable && (
        <DistributionStatisticsTable
          overallStatistics={overallStatistics}
          metricStatistics={metricStatistics}
          headerAction={statisticsFullscreenButton}
        />
      )}

      <Dialog fullScreen open={fullscreenSection === 'histogram'} onClose={executeCloseFullscreen}>
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar variant="dense">
            <Typography variant="subtitle1" component="span" sx={{ flex: 1, fontWeight: 600 }}>
              Score distribution — histogram
            </Typography>
            <Tooltip title="Exit full screen">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="Close full screen histogram"
                onClick={executeCloseFullscreen}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, overflow: 'auto', bgcolor: 'background.default' }}>
          <DistributionHistogramPanel
            bins={scoreDistributionBins}
            chartHeightPx={fullscreenSingleChartPlotHeightPx}
          />
        </Box>
      </Dialog>

      <Dialog fullScreen open={fullscreenSection === 'boxplot'} onClose={executeCloseFullscreen}>
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar variant="dense">
            <Typography variant="subtitle1" component="span" sx={{ flex: 1, fontWeight: 600 }}>
              Score distribution — box plot
            </Typography>
            <Tooltip title="Exit full screen">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="Close full screen box plot"
                onClick={executeCloseFullscreen}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, overflow: 'auto', bgcolor: 'background.default' }}>
          <DistributionBoxPlotPanel
            metricStatistics={metricStatistics}
            plotHeightPx={fullscreenSingleChartPlotHeightPx}
          />
        </Box>
      </Dialog>

      <Dialog fullScreen open={fullscreenSection === 'statistics'} onClose={executeCloseFullscreen}>
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar variant="dense">
            <Typography variant="subtitle1" component="span" sx={{ flex: 1, fontWeight: 600 }}>
              Score distribution — statistics
            </Typography>
            <Tooltip title="Exit full screen">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="Close full screen statistics"
                onClick={executeCloseFullscreen}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2, overflow: 'auto', bgcolor: 'background.default', minHeight: '45vh' }}>
          <DistributionStatisticsTable
            overallStatistics={overallStatistics}
            metricStatistics={metricStatistics}
          />
        </Box>
      </Dialog>

      {showStatisticsTable && filterValue.scaleId === RESPONSE_FILTER_ALL_SCALES && (
        <Typography variant="caption" color="text.secondary">
          Showing one row per metric (scale) in the current rubric/section scope.
        </Typography>
      )}
    </Stack>
  );
}
