import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import type { ScaleDistributionHistogramProps } from './scaleHistogramTypes';

const DEFAULT_CHART_HEIGHT = 320;
const DEFAULT_COUNT_AXIS_LABEL = 'Count';
const DEFAULT_LEVEL_AXIS_LABEL = 'Rubric level';
const DEFAULT_SERIES_LABEL = 'Responses';

type HistogramRow = {
  levelLabel: string;
  count: number;
};

export default function ScaleDistributionHistogram({
  title,
  scalePrompt,
  bins,
  height = DEFAULT_CHART_HEIGHT,
  countAxisLabel = DEFAULT_COUNT_AXIS_LABEL,
  levelAxisLabel = DEFAULT_LEVEL_AXIS_LABEL,
  seriesLabel = DEFAULT_SERIES_LABEL,
}: ScaleDistributionHistogramProps) {
  const dataset: HistogramRow[] = bins.map((bin) => ({
    levelLabel: bin.label,
    count: bin.count,
  }));

  const chartTitle = title ?? 'Score distribution';
  const chartSubtitleId = scalePrompt ? `${chartTitle}-subtitle` : undefined;

  if (dataset.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        {title && (
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
        )}
        {scalePrompt && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {scalePrompt}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          No distribution data for this scale.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="figure"
      sx={{ width: 1, m: 0 }}
      aria-label={scalePrompt ? `${chartTitle}: ${scalePrompt}` : chartTitle}
    >
      {title && (
        <Typography component="figcaption" variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
      )}
      {scalePrompt && (
        <Typography id={chartSubtitleId} variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {scalePrompt}
        </Typography>
      )}
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'levelLabel',
            label: levelAxisLabel,
          },
        ]}
        yAxis={[{ label: countAxisLabel }]}
        series={[
          {
            type: 'bar',
            dataKey: 'count',
            label: seriesLabel,
          },
        ]}
        height={height}
        sx={{ width: 1 }}
        barLabel="value"
        margin={{ left: 48, right: 12, top: 8, bottom: 40 }}
      />
    </Box>
  );
}
