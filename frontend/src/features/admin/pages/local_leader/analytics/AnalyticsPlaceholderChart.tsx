import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import type { Rubric } from '@shared/types';
import ResponseDistributionAnalyticsChart from './ResponseDistributionAnalyticsChart';
import {
  createInitialResponseGraphFilter,
  type ResponseGraphFilterValue,
} from './responseGraphFilterTypes';
import type { AnalyticsGraphId } from './useAnalyticsGraphWorkspace';
import { ANALYTICS_GRAPH_META } from './useAnalyticsGraphWorkspace';

type AnalyticsPlaceholderChartProps = {
  graphId: AnalyticsGraphId;
  variant: 'playground' | 'carousel';
  /** Shown under the title for response charts when filters are applied (playground shows all lines; carousel shows first two). */
  filterLines?: string[];
  rubrics?: Rubric[];
  responseFilter?: ResponseGraphFilterValue;
  rangeStartInput?: string;
  rangeEndInput?: string;
};

const PLAYGROUND_HEIGHT = 340;
const CAROUSEL_HEIGHT = 140;

/** Minimum width per band category so wide bar charts scroll instead of shrinking unreadably. */
const PLAYGROUND_MIN_WIDTH_PER_CATEGORY_PX = 56;
const PLAYGROUND_CHART_MIN_WIDTH_PX = 520;

const PLACEHOLDER_DATASETS: Record<
  AnalyticsGraphId,
  { rows: { label: string; value: number }[]; seriesLabel: string }
> = {
  'users-overview': {
    rows: [
      { label: 'Faculty', value: 18 },
      { label: 'Reviewers', value: 24 },
      { label: 'Leads', value: 4 },
    ],
    seriesLabel: 'Users',
  },
  'users-courses': {
    rows: [
      { label: 'Geometry', value: 12 },
      { label: 'Calculus', value: 20 },
      { label: 'Advanced', value: 7 },
    ],
    seriesLabel: 'Assignments',
  },
  'responses-throughput': {
    rows: [
      { label: 'Week 1', value: 14 },
      { label: 'Week 2', value: 22 },
      { label: 'Week 3', value: 19 },
      { label: 'Week 4', value: 31 },
    ],
    seriesLabel: 'Responses',
  },
  'responses-distribution': {
    rows: [
      { label: 'L0', value: 3 },
      { label: 'L1', value: 9 },
      { label: 'L2', value: 16 },
      { label: 'L3', value: 11 },
      { label: 'L4', value: 5 },
    ],
    seriesLabel: 'Count',
  },
};

export default function AnalyticsPlaceholderChart({
  graphId,
  variant,
  filterLines,
  rubrics,
  responseFilter,
  rangeStartInput,
  rangeEndInput,
}: AnalyticsPlaceholderChartProps) {
  const height = variant === 'playground' ? PLAYGROUND_HEIGHT : CAROUSEL_HEIGHT;
  const meta = ANALYTICS_GRAPH_META[graphId];
  const preset = PLACEHOLDER_DATASETS[graphId];
  const linesToShow = variant === 'playground' ? filterLines : filterLines?.slice(0, 2);

  const playgroundChartWidth = Math.max(
    PLAYGROUND_CHART_MIN_WIDTH_PX,
    preset.rows.length * PLAYGROUND_MIN_WIDTH_PER_CATEGORY_PX
  );

  const shouldRenderResponseDistributionAnalytics =
    graphId === 'responses-distribution' &&
    variant === 'playground' &&
    Array.isArray(rubrics) &&
    responseFilter &&
    typeof rangeStartInput === 'string' &&
    typeof rangeEndInput === 'string';

  return (
    <Box sx={{ width: 1, minWidth: 0 }}>
      <Typography
        variant={variant === 'playground' ? 'subtitle1' : 'caption'}
        sx={{ fontWeight: 600, mb: 0.5 }}
      >
        {meta.title}
      </Typography>
      {variant === 'playground' && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {meta.description}
        </Typography>
      )}
      {linesToShow && linesToShow.length > 0 && (
        <Box
          sx={{
            mb: variant === 'playground' ? 1 : 0.5,
            pl: 0.5,
            borderLeft: 2,
            borderColor: 'primary.light',
          }}
        >
          {linesToShow.map((line, index) => (
            <Typography
              key={`${graphId}-filter-${index}`}
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ lineHeight: 1.4 }}
            >
              {line}
            </Typography>
          ))}
        </Box>
      )}
      {shouldRenderResponseDistributionAnalytics && (
        <ResponseDistributionAnalyticsChart
          rubrics={rubrics ?? []}
          filterValue={responseFilter ?? createInitialResponseGraphFilter()}
          rangeStartInput={rangeStartInput ?? ''}
          rangeEndInput={rangeEndInput ?? ''}
        />
      )}
      {!shouldRenderResponseDistributionAnalytics &&
        (variant === 'playground' ? (
          <Box
            sx={{ width: playgroundChartWidth, minWidth: playgroundChartWidth, maxWidth: 'none' }}
          >
            <BarChart
              dataset={preset.rows}
              xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
              yAxis={[{ label: 'Count' }]}
              series={[
                {
                  type: 'bar',
                  dataKey: 'value',
                  label: preset.seriesLabel,
                },
              ]}
              width={playgroundChartWidth}
              height={height}
              sx={{ width: playgroundChartWidth }}
              margin={{ left: 48, right: 16, top: 8, bottom: 36 }}
            />
          </Box>
        ) : (
          <BarChart
            dataset={preset.rows}
            xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
            yAxis={[{ label: '' }]}
            series={[
              {
                type: 'bar',
                dataKey: 'value',
                label: preset.seriesLabel,
              },
            ]}
            height={height}
            sx={{ width: 1 }}
            margin={{ left: 32, right: 8, top: 4, bottom: 28 }}
          />
        ))}
    </Box>
  );
}
