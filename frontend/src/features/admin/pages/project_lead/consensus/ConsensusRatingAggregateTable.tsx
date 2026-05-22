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
import { alpha, useTheme, type Theme } from '@mui/material/styles';
import { Fragment, useMemo } from 'react';
import type { Rubric, RubricScale } from '@shared/types';

export const CONSENSUS_RATING_COLUMNS = [1, 2, 3, 4] as const;
const RATING_COLUMNS = CONSENSUS_RATING_COLUMNS;

const HEATMAP_SHADE_ALPHA_MIN = 0.12;
const HEATMAP_SHADE_ALPHA_RANGE = 0.62;

const RUBRIC_CODE_PREFIX = /^(\d+\.[A-Z]\d+\.\s+)/;

/** First title sentence of a rubric scale prompt (e.g. "1.A1. Collecting… data. "). */
export function formatScalePromptFirstSentence(prompt: string): string {
  const normalized = prompt.replace(/\s+/g, ' ').trim();
  const prefixMatch = normalized.match(RUBRIC_CODE_PREFIX);
  const searchIn = prefixMatch ? normalized.slice(prefixMatch[1].length) : normalized;
  const prefix = prefixMatch?.[1] ?? '';
  const breakIndex = searchIn.search(/\.\s+/);
  if (breakIndex === -1) {
    return normalized;
  }
  return `${prefix}${searchIn.slice(0, breakIndex + 1)} `;
}

type HeatmapVariant = 'primary' | 'redWhite';

export type ConsensusHeatmapLegendProps = {
  primaryLabel?: string;
  showComparisonLegend?: boolean;
  comparisonLabel?: string;
  showInstitutionConsensusOutlineLegend?: boolean;
};

export function ConsensusHeatmapLegend({
  primaryLabel = 'Heat scale (per row)',
  showComparisonLegend = false,
  comparisonLabel = 'Other institutions',
  showInstitutionConsensusOutlineLegend = false,
}: ConsensusHeatmapLegendProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
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
          {primaryLabel}
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
      {showComparisonLegend ? (
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
      {showInstitutionConsensusOutlineLegend ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Outlined cell
          </Typography>
          <Box
            sx={{
              width: 28,
              height: 20,
              borderRadius: 0.5,
              bgcolor: theme.palette.grey[100],
              ...getInstitutionConsensusOutlineSx(theme),
            }}
          />
          <Typography variant="caption" color="text.secondary">
            = your institution&apos;s submitted consensus for that rating
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

function ScalePromptCell({ prompt }: { prompt: string }) {
  const displayPrompt = formatScalePromptFirstSentence(prompt);
  const showFullPromptTooltip = displayPrompt !== prompt.replace(/\s+/g, ' ').trim();

  const label = (
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {displayPrompt}
    </Typography>
  );

  if (!showFullPromptTooltip) {
    return label;
  }

  return (
    <Tooltip title={prompt} slotProps={{ tooltip: { sx: { maxWidth: 420 } } }}>
      <Box component="span" sx={{ display: 'block', cursor: 'help' }}>
        {label}
      </Box>
    </Tooltip>
  );
}

export type ConsensusRatingAggregateResponse = {
  byScaleVersionId: Record<string, Record<string, number>>;
  consensusSubmissionCount: number;
  /** Present when the aggregate API was called with per-score institution breakdown. */
  institutionNamesByScaleAndRating?: Record<string, Record<string, string[]>>;
  /** Submitted consensus scores per scale (local leader overview; respects course-bin scope). */
  institutionConsensusRatingsByScaleVersionId?: Record<string, number[]>;
};

/** Outline ratings from API highlights when present, else derived from aggregate counts. */
export function resolveInstitutionConsensusRatingsByScaleVersionId(
  aggregate: ConsensusRatingAggregateResponse | null | undefined
): Record<string, number[]> {
  const fromApi = aggregate?.institutionConsensusRatingsByScaleVersionId;
  if (fromApi !== undefined) {
    return fromApi;
  }
  return buildInstitutionConsensusRatingsByScaleVersionId(aggregate?.byScaleVersionId);
}

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

export function getCountForRating(
  bucket: Record<string, number> | undefined,
  rating: number
): number {
  if (!bucket) return 0;
  const raw = bucket[String(rating)] ?? bucket[rating as unknown as string];
  return typeof raw === 'number' ? raw : 0;
}

/** Ratings 1–4 where the institution has at least one submitted consensus at that score. */
export function buildInstitutionConsensusRatingsByScaleVersionId(
  byScaleVersionId: Record<string, Record<string, number>> | undefined
): Record<string, number[]> {
  if (!byScaleVersionId) return {};
  const result: Record<string, number[]> = {};
  for (const [scaleVersionId, bucket] of Object.entries(byScaleVersionId)) {
    const ratings = CONSENSUS_RATING_COLUMNS.filter(
      (rating) => getCountForRating(bucket, rating) > 0
    );
    if (ratings.length > 0) {
      result[scaleVersionId] = [...ratings];
    }
  }
  return result;
}

const INSTITUTION_CONSENSUS_TOOLTIP = "Your institution's submitted consensus rating";

/** Distinct from primary (blue) heatmap fills so submitted-consensus cells are easy to spot. */
function getInstitutionConsensusOutlineSx(theme: Theme) {
  return {
    outline: `2px solid ${theme.palette.warning.dark}`,
    outlineOffset: -2,
  } as const;
}

type TabularCountCellProps = {
  count: number;
  rowMax: number;
  heatmapVariant?: HeatmapVariant;
  tooltipInstitutionNames?: string[];
  isInstitutionConsensusRating?: boolean;
};

function TabularCountCell({
  count,
  rowMax,
  heatmapVariant = 'primary',
  tooltipInstitutionNames,
  isInstitutionConsensusRating = false,
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

  const hasInstitutionListTooltip =
    count > 0 && tooltipInstitutionNames !== undefined && tooltipInstitutionNames.length > 0;
  const hasConsensusHighlightTooltip = isInstitutionConsensusRating;
  const hasTooltip = hasInstitutionListTooltip || hasConsensusHighlightTooltip;

  const cellContent = (
    <Box
      component="span"
      sx={{
        display: 'block',
        ...(hasTooltip ? { cursor: 'help' } : {}),
      }}
    >
      {count}
    </Box>
  );

  const tooltipTitle = hasInstitutionListTooltip ? (
    <Box sx={{ maxHeight: 260, overflow: 'auto', py: 0.5 }}>
      {tooltipInstitutionNames!.map((label, index) => (
        <Typography key={`${label}-${index}`} variant="caption" display="block">
          {label}
        </Typography>
      ))}
    </Box>
  ) : (
    INSTITUTION_CONSENSUS_TOOLTIP
  );

  const wrappedContent = hasTooltip ? (
    <Tooltip title={tooltipTitle} slotProps={{ tooltip: { sx: { maxWidth: 380 } } }}>
      {cellContent}
    </Tooltip>
  ) : (
    cellContent
  );

  return (
    <TableCell
      align="center"
      sx={{
        backgroundColor,
        fontWeight: isInstitutionConsensusRating || count > 0 ? 700 : 400,
        ...(isInstitutionConsensusRating ? getInstitutionConsensusOutlineSx(theme) : {}),
      }}
    >
      {wrappedContent}
    </TableCell>
  );
}

export type ConsensusRatingAggregateTableProps = {
  rubric: Rubric;
  aggregate: ConsensusRatingAggregateResponse | null;
  comparisonAggregate?: ConsensusRatingAggregateResponse | null;
  comparisonLabel?: string;
  /** Legend label for the primary heatmap when comparison rows are emphasized. */
  primaryScopeLabel?: string;
  /** When set, comparison rows use distinct label alignment and heatmap colors (local leader overview). */
  comparisonPresentation?: 'default' | 'localLeadEmphasis';
  /** Primary-row cells at these ratings per scale get an outline (institution submitted consensus). */
  institutionConsensusRatingsByScaleVersionId?: Record<string, readonly number[]>;
  /** When false, heatmap legend is omitted (show once at page level via ConsensusHeatmapLegend). */
  showHeatmapLegend?: boolean;
};

export function ConsensusRatingAggregateTable({
  rubric,
  aggregate,
  comparisonAggregate = null,
  comparisonLabel = 'Other institutions',
  primaryScopeLabel = 'your institution',
  comparisonPresentation = 'default',
  institutionConsensusRatingsByScaleVersionId,
  showHeatmapLegend = false,
}: ConsensusRatingAggregateTableProps) {
  const shouldEmphasizeComparisonRows = comparisonPresentation === 'localLeadEmphasis';
  const comparisonHeatmapVariant: HeatmapVariant = shouldEmphasizeComparisonRows
    ? 'redWhite'
    : 'primary';
  const primaryHeatmapLegendLabel =
    shouldEmphasizeComparisonRows && comparisonAggregate
      ? `Heat scale (per row, ${primaryScopeLabel})`
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
  const hasInstitutionConsensusHighlights = useMemo(
    () =>
      institutionConsensusRatingsByScaleVersionId !== undefined &&
      Object.keys(institutionConsensusRatingsByScaleVersionId).length > 0,
    [institutionConsensusRatingsByScaleVersionId]
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
                        <TableCell sx={{ maxWidth: 520, whiteSpace: 'normal' }}>
                          <ScalePromptCell prompt={scale.prompt} />
                        </TableCell>
                        {RATING_COLUMNS.map((rating, index) => {
                          const highlightedRatings =
                            institutionConsensusRatingsByScaleVersionId?.[scale.id] ?? [];
                          return (
                            <TabularCountCell
                              key={rating}
                              count={counts[index] ?? 0}
                              rowMax={rowMax}
                              tooltipInstitutionNames={
                                namesByScaleAndRating?.[scale.id]?.[String(rating)]
                              }
                              isInstitutionConsensusRating={highlightedRatings.includes(rating)}
                            />
                          );
                        })}
                      </TableRow>
                      {comparisonAggregate ? (
                        <TableRow>
                          <TableCell
                            align={shouldEmphasizeComparisonRows ? 'right' : 'left'}
                            sx={{
                              ...(shouldEmphasizeComparisonRows
                                ? { pr: 1, pl: 1, textAlign: 'right' }
                                : { pl: 4 }),
                              maxWidth: 520,
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

      {showHeatmapLegend ? (
        <Box sx={{ mt: 1 }}>
          <ConsensusHeatmapLegend
            primaryLabel={primaryHeatmapLegendLabel}
            showComparisonLegend={shouldEmphasizeComparisonRows && Boolean(comparisonAggregate)}
            comparisonLabel={comparisonLabel}
            showInstitutionConsensusOutlineLegend={hasInstitutionConsensusHighlights}
          />
        </Box>
      ) : null}
    </>
  );
}
