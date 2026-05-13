import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Fragment, useMemo } from 'react';
import type { Rubric, RubricScale } from '@shared/types';

const RATING_COLUMNS = [1, 2, 3, 4] as const;

const HEATMAP_SHADE_ALPHA_MIN = 0.12;
const HEATMAP_SHADE_ALPHA_RANGE = 0.62;

type HeatmapVariant = 'primary' | 'redWhite';

export type ConsensusRatingAggregateResponse = {
  byScaleVersionId: Record<string, Record<string, number>>;
  consensusSubmissionCount: number;
  /** Present when the aggregate API was called with per-score institution breakdown. */
  institutionNamesByScaleAndRating?: Record<string, Record<string, string[]>>;
};

function sortScalesByOrder(scales: RubricScale[]): RubricScale[] {
  return [...scales].sort((a, b) => a.orderIndex - b.orderIndex);
}

function groupScalesBySection(sortedScales: RubricScale[]): {
  sectionKeys: string[];
  bySection: Map<string, RubricScale[]>;
} {
  const sectionKeys: string[] = [];
  const bySection = new Map<string, RubricScale[]>();
  for (const scale of sortedScales) {
    const key = scale.section?.trim() ? scale.section.trim() : 'General';
    if (!bySection.has(key)) {
      sectionKeys.push(key);
      bySection.set(key, []);
    }
    bySection.get(key)!.push(scale);
  }
  return { sectionKeys, bySection };
}

function getCountForRating(bucket: Record<string, number> | undefined, rating: number): number {
  if (!bucket) return 0;
  const raw = bucket[String(rating)] ?? bucket[rating as unknown as string];
  return typeof raw === 'number' ? raw : 0;
}

type TabularCountCellProps = {
  count: number;
  rowMax: number;
  heatmapVariant?: HeatmapVariant;
  tooltipInstitutionNames?: string[];
};

function TabularCountCell({
  count,
  rowMax,
  heatmapVariant = 'primary',
  tooltipInstitutionNames,
}: TabularCountCellProps) {
  const theme = useTheme();
  const baseColor =
    heatmapVariant === 'redWhite' ? theme.palette.error.main : theme.palette.primary.main;
  const emptyBackgroundColor =
    heatmapVariant === 'redWhite' ? theme.palette.common.white : theme.palette.grey[100];
  const backgroundColor =
    count <= 0 || rowMax <= 0
      ? emptyBackgroundColor
      : alpha(baseColor, HEATMAP_SHADE_ALPHA_MIN + (count / rowMax) * HEATMAP_SHADE_ALPHA_RANGE);

  const hasInstitutionTooltip =
    count > 0 && tooltipInstitutionNames !== undefined && tooltipInstitutionNames.length > 0;

  const cellContent = (
    <Box
      component="span"
      sx={{
        display: 'block',
        ...(hasInstitutionTooltip ? { cursor: 'help' } : {}),
      }}
    >
      {count}
    </Box>
  );

  return (
    <TableCell
      align="center"
      sx={{
        backgroundColor,
        fontWeight: count > 0 ? 600 : 400,
      }}
    >
      {hasInstitutionTooltip ? (
        <Tooltip
          title={
            <Box sx={{ maxHeight: 260, overflow: 'auto', py: 0.5 }}>
              {tooltipInstitutionNames.map((label, index) => (
                <Typography key={`${label}-${index}`} variant="caption" display="block">
                  {label}
                </Typography>
              ))}
            </Box>
          }
          slotProps={{ tooltip: { sx: { maxWidth: 380 } } }}
        >
          {cellContent}
        </Tooltip>
      ) : (
        cellContent
      )}
    </TableCell>
  );
}

export type ConsensusRatingAggregateTableProps = {
  rubric: Rubric;
  aggregate: ConsensusRatingAggregateResponse | null;
  comparisonAggregate?: ConsensusRatingAggregateResponse | null;
  comparisonLabel?: string;
  /** When set, comparison rows use distinct label alignment and heatmap colors (local leader overview). */
  comparisonPresentation?: 'default' | 'localLeadEmphasis';
};

export function ConsensusRatingAggregateTable({
  rubric,
  aggregate,
  comparisonAggregate = null,
  comparisonLabel = 'Other institutions',
  comparisonPresentation = 'default',
}: ConsensusRatingAggregateTableProps) {
  const theme = useTheme();
  const shouldEmphasizeComparisonRows = comparisonPresentation === 'localLeadEmphasis';
  const comparisonHeatmapVariant: HeatmapVariant = shouldEmphasizeComparisonRows
    ? 'redWhite'
    : 'primary';
  const primaryHeatmapLegendLabel =
    shouldEmphasizeComparisonRows && comparisonAggregate
      ? 'Heat scale (per row, your institution)'
      : 'Heat scale (per row)';
  const byScale = aggregate?.byScaleVersionId ?? {};
  const namesByScaleAndRating = aggregate?.institutionNamesByScaleAndRating;
  const submissionCount = aggregate?.consensusSubmissionCount ?? 0;
  const comparisonByScale = comparisonAggregate?.byScaleVersionId ?? {};
  const comparisonSubmissionCount = comparisonAggregate?.consensusSubmissionCount ?? 0;

  const sortedScales = useMemo(() => sortScalesByOrder(rubric.scales ?? []), [rubric.scales]);
  const { sectionKeys, bySection } = useMemo(
    () => groupScalesBySection(sortedScales),
    [sortedScales]
  );

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Consensus forms in scope: {submissionCount}
        {submissionCount === 0 ? (
          <Typography component="span" variant="body2" color="text.disabled" sx={{ ml: 1 }}>
            (no submissions — counts show as zero)
          </Typography>
        ) : null}
      </Typography>
      {comparisonAggregate ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {comparisonLabel} forms in scope: {comparisonSubmissionCount}
        </Typography>
      ) : null}

      <Table size="small" sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Information</TableCell>
            {RATING_COLUMNS.map((rating) => (
              <TableCell key={rating} align="center" sx={{ fontWeight: 700 }}>
                {rating}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={1 + RATING_COLUMNS.length}
              sx={{ backgroundColor: 'action.hover', fontWeight: 600 }}
            >
              {rubric.title}
            </TableCell>
          </TableRow>
          {sectionKeys.map((sectionName) => {
            const scalesInSection = bySection.get(sectionName) ?? [];
            return (
              <Fragment key={sectionName}>
                <TableRow>
                  <TableCell
                    colSpan={1 + RATING_COLUMNS.length}
                    sx={{ backgroundColor: 'action.selected', fontWeight: 600 }}
                  >
                    {sectionName}
                  </TableCell>
                </TableRow>
                {scalesInSection.map((scale) => {
                  const bucket = byScale[scale.id];
                  const counts = RATING_COLUMNS.map((r) => getCountForRating(bucket, r));
                  const rowMax = Math.max(...counts, 1);
                  const comparisonBucket = comparisonByScale[scale.id];
                  const comparisonCounts = RATING_COLUMNS.map((rating) =>
                    getCountForRating(comparisonBucket, rating)
                  );
                  const comparisonRowMax = Math.max(...comparisonCounts, 1);
                  const comparisonCount0 = getCountForRating(comparisonBucket, 0);
                  return (
                    <Fragment key={scale.id}>
                      <TableRow>
                        <TableCell sx={{ maxWidth: 360, whiteSpace: 'normal' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {scale.prompt}
                          </Typography>
                        </TableCell>
                        {RATING_COLUMNS.map((rating, index) => (
                          <TabularCountCell
                            key={rating}
                            count={counts[index] ?? 0}
                            rowMax={rowMax}
                            tooltipInstitutionNames={
                              namesByScaleAndRating?.[scale.id]?.[String(rating)]
                            }
                          />
                        ))}
                      </TableRow>
                      {comparisonAggregate ? (
                        <TableRow>
                          <TableCell
                            align={shouldEmphasizeComparisonRows ? 'right' : 'left'}
                            sx={{
                              ...(shouldEmphasizeComparisonRows
                                ? { pr: 1, pl: 1, textAlign: 'right' }
                                : { pl: 4 }),
                              maxWidth: 360,
                              whiteSpace: 'normal',
                              backgroundColor: 'action.hover',
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontWeight: 600,
                                display: 'block',
                                textAlign: shouldEmphasizeComparisonRows ? 'right' : 'left',
                              }}
                            >
                              {comparisonLabel}
                            </Typography>
                            {comparisonCount0 > 0 ? (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{
                                  textAlign: shouldEmphasizeComparisonRows ? 'right' : 'left',
                                }}
                              >
                                Rating 0: {comparisonCount0}
                              </Typography>
                            ) : null}
                          </TableCell>
                          {RATING_COLUMNS.map((rating, index) => (
                            <TabularCountCell
                              key={`${rating}-comparison`}
                              count={comparisonCounts[index] ?? 0}
                              rowMax={comparisonRowMax}
                              heatmapVariant={comparisonHeatmapVariant}
                            />
                          ))}
                        </TableRow>
                      ) : null}
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>

      <Box
        sx={{
          mt: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {primaryHeatmapLegendLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Lower
          </Typography>
          <Box
            sx={{
              flex: 1,
              minWidth: 120,
              maxWidth: 280,
              height: 10,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, HEATMAP_SHADE_ALPHA_MIN)}, ${theme.palette.primary.main})`,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Higher
          </Typography>
        </Box>
        {shouldEmphasizeComparisonRows && comparisonAggregate ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Heat scale ({comparisonLabel})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Lower
            </Typography>
            <Box
              sx={{
                flex: 1,
                minWidth: 120,
                maxWidth: 280,
                height: 10,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                background: `linear-gradient(to right, ${theme.palette.common.white}, ${theme.palette.error.main})`,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Higher
            </Typography>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
