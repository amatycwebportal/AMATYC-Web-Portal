import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import {
  formatInstitutionLabel,
  useFetchInstitutions,
} from '@utils/hooks/institutions/useFetchInstitutions';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import type { Rubric } from '@shared/types';
import {
  ConsensusHeatmapLegend,
  ConsensusRatingAggregateTable,
  resolveInstitutionConsensusRatingsByScaleVersionId,
  type ConsensusRatingAggregateResponse,
} from '../../project_lead/consensus/ConsensusRatingAggregateTable';

const GENERAL_COURSE_BIN_KEY = '__general__';

type CourseBinScopeOption = {
  id: string;
  label: string;
};

const generalCourseBinOption: CourseBinScopeOption = {
  id: GENERAL_COURSE_BIN_KEY,
  label: 'General (no course bin)',
};

type OverviewRubricMeta = {
  rubricParentId: string;
  title: string;
  rubricVersionId: string;
  versionNum: number;
};

type LoadedOverviewRow = OverviewRubricMeta & {
  rubricDetail: Rubric | null;
  institutionAggregate: ConsensusRatingAggregateResponse | null;
  institutionConsensusRatingsByScaleVersionId: Record<string, number[]>;
  otherInstitutionsAggregate: ConsensusRatingAggregateResponse | null;
  selectedCourseBinIds: string[];
  loadError: string | null;
};

type ScaleDistributionInsight = {
  scoreCounts: Record<number, number>;
  average: number | null;
};

type ScaleDistributionResponse = {
  byScaleVersionId: Record<string, ScaleDistributionInsight>;
};

function getLatestRubricVersionEntry(rubric: Rubric): { id: string; versionNum: number } | null {
  const versions = rubric.versions ?? [];
  if (versions.length === 0) return null;
  return versions.reduce((best, versionEntry) =>
    versionEntry.versionNum > best.versionNum ? versionEntry : best
  );
}

function buildScaleDistributionAggregate(
  data: ScaleDistributionResponse
): ConsensusRatingAggregateResponse {
  const byScaleVersionId = Object.fromEntries(
    Object.entries(data.byScaleVersionId ?? {}).map(([scaleVersionId, insight]) => [
      scaleVersionId,
      {
        0: insight.scoreCounts?.[0] ?? 0,
        1: insight.scoreCounts?.[1] ?? 0,
        2: insight.scoreCounts?.[2] ?? 0,
        3: insight.scoreCounts?.[3] ?? 0,
        4: insight.scoreCounts?.[4] ?? 0,
      },
    ])
  );
  const consensusSubmissionCount = Object.values(byScaleVersionId).reduce(
    (maxScaleTotal, bucket) => {
      const scaleTotal = Object.values(bucket as Record<string, number>).reduce(
        (sum, count) => sum + count,
        0
      );
      return Math.max(maxScaleTotal, scaleTotal);
    },
    0
  );
  return { byScaleVersionId, consensusSubmissionCount };
}

async function fetchLocalLeaderScaleDistributions({
  backendUrl,
  rubricVersionId,
  courseBinIds,
}: {
  backendUrl: string;
  rubricVersionId: string;
  courseBinIds?: string[];
}): Promise<{ aggregate: ConsensusRatingAggregateResponse | null; error: string | null }> {
  const params = new URLSearchParams({ rubricVersionId });
  if (courseBinIds && courseBinIds.length > 0) {
    params.set('courseBinIds', courseBinIds.join(','));
  }
  const response = await fetch(`${backendUrl}/consensus/scale-distributions?${params}`, {
    credentials: 'include',
  });
  const data = (await response.json()) as ScaleDistributionResponse & { error?: string };
  if (!response.ok) {
    return { aggregate: null, error: data.error ?? 'Could not load aggregate' };
  }
  return { aggregate: buildScaleDistributionAggregate(data), error: null };
}

async function fetchLocalLeaderConsensusRatingAggregate({
  backendUrl,
  rubricVersionId,
  courseBinIds,
  compareAgainstOtherInstitutions,
}: {
  backendUrl: string;
  rubricVersionId: string;
  courseBinIds?: string[];
  compareAgainstOtherInstitutions?: boolean;
}): Promise<{ aggregate: ConsensusRatingAggregateResponse | null; error: string | null }> {
  const params = new URLSearchParams({ rubricVersionId });
  if (compareAgainstOtherInstitutions) {
    params.set('compareAgainstOtherInstitutions', 'true');
  }
  if (courseBinIds && courseBinIds.length > 0) {
    params.set('courseBinIds', courseBinIds.join(','));
  }
  const response = await fetch(
    `${backendUrl}/consensus/local-leader-consensus-rating-aggregate?${params}`,
    { credentials: 'include' }
  );
  const data = (await response.json()) as ConsensusRatingAggregateResponse & { error?: string };
  if (!response.ok) {
    return { aggregate: null, error: data.error ?? 'Could not load institution consensus' };
  }
  return { aggregate: data, error: null };
}

export default function LocalLeaderConsensusGeneralOverviewPage() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useFetchUser();
  const { institutions } = useFetchInstitutions(true);
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
  const { courseBins, isLoadingCourseBins, hasCourseBinsError } = useFetchInstitutionCourseBins(
    user?.institutionId
  );

  const courseBinOptions = useMemo((): CourseBinScopeOption[] => {
    const institutionBins = (courseBins ?? []).map((bin) => ({
      id: bin.id,
      label: bin.displayName,
    }));
    return [generalCourseBinOption, ...institutionBins];
  }, [courseBins]);

  const [shouldCompareAgainstOtherInstitutions, setShouldCompareAgainstOtherInstitutions] =
    useState(false);
  const [rows, setRows] = useState<LoadedOverviewRow[]>([]);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);
  const courseBinSelectionByRubricVersionIdRef = useRef<Map<string, string[]>>(new Map());

  const institutionLabel = useMemo(() => {
    if (!user?.institutionId) return 'Your institution';
    const institution = institutions.find((row) => row.id === user.institutionId);
    return institution ? formatInstitutionLabel(institution) : 'Your institution';
  }, [institutions, user?.institutionId]);

  const overviewRubrics = useMemo((): OverviewRubricMeta[] => {
    if (!rubrics || rubrics.length === 0) return [];
    const rubricMetas: OverviewRubricMeta[] = [];
    for (const rubricRow of rubrics) {
      if (!rubricRow.active) continue;
      const latestVersion = getLatestRubricVersionEntry(rubricRow);
      if (!latestVersion) continue;
      rubricMetas.push({
        rubricParentId: rubricRow.id,
        title: rubricRow.title,
        rubricVersionId: latestVersion.id,
        versionNum: latestVersion.versionNum,
      });
    }
    return rubricMetas.sort((a, b) => a.title.localeCompare(b.title));
  }, [rubrics]);

  const loadOverview = useCallback(
    async (selectionByRubricVersionId?: Map<string, string[]>) => {
      if (!backendUrl) return;
      if (overviewRubrics.length === 0) {
        setRows([]);
        return;
      }

      setIsLoadingOverview(true);
      try {
        const loadedRows = await Promise.all(
          overviewRubrics.map(async (meta) => {
            const selectedCourseBinIds =
              selectionByRubricVersionId?.get(meta.rubricVersionId) ?? [];
            const scopeCourseBinIds =
              selectedCourseBinIds.length > 0 ? selectedCourseBinIds : undefined;
            let rubricDetail: Rubric | null = null;
            let institutionAggregate: ConsensusRatingAggregateResponse | null = null;
            let institutionConsensusRatingsByScaleVersionId: Record<string, number[]> = {};
            let otherInstitutionsAggregate: ConsensusRatingAggregateResponse | null = null;
            let loadError: string | null = null;

            try {
              const detailResponse = await fetch(
                `${backendUrl}/rubrics/version/${meta.rubricVersionId}`,
                {
                  credentials: 'include',
                }
              );
              if (detailResponse.ok) {
                rubricDetail = (await detailResponse.json()) as Rubric;
              } else {
                loadError = 'Could not load rubric structure';
              }
            } catch {
              loadError = 'Could not load rubric structure';
            }

            try {
              const { aggregate, error } = await fetchLocalLeaderScaleDistributions({
                backendUrl,
                rubricVersionId: meta.rubricVersionId,
                courseBinIds: scopeCourseBinIds,
              });
              if (error) {
                loadError = loadError ?? error;
              } else {
                institutionAggregate = aggregate;
              }
            } catch {
              loadError = loadError ?? 'Could not load aggregate';
            }

            try {
              const { aggregate, error } = await fetchLocalLeaderConsensusRatingAggregate({
                backendUrl,
                rubricVersionId: meta.rubricVersionId,
                courseBinIds: scopeCourseBinIds,
              });
              if (error) {
                loadError = loadError ?? error;
              } else {
                institutionConsensusRatingsByScaleVersionId =
                  resolveInstitutionConsensusRatingsByScaleVersionId(aggregate);
              }
            } catch {
              loadError = loadError ?? 'Could not load institution consensus';
              institutionConsensusRatingsByScaleVersionId = {};
            }

            if (shouldCompareAgainstOtherInstitutions) {
              try {
                const { aggregate, error } = await fetchLocalLeaderConsensusRatingAggregate({
                  backendUrl,
                  rubricVersionId: meta.rubricVersionId,
                  courseBinIds: scopeCourseBinIds,
                  compareAgainstOtherInstitutions: true,
                });
                if (error) {
                  loadError = loadError ?? error;
                } else {
                  otherInstitutionsAggregate = aggregate;
                }
              } catch {
                loadError = loadError ?? 'Could not load comparison aggregate';
              }
            }

            return {
              ...meta,
              rubricDetail,
              institutionAggregate,
              institutionConsensusRatingsByScaleVersionId,
              otherInstitutionsAggregate,
              selectedCourseBinIds,
              loadError,
            };
          })
        );
        setRows(loadedRows);
      } finally {
        setIsLoadingOverview(false);
      }
    },
    [backendUrl, overviewRubrics, shouldCompareAgainstOtherInstitutions]
  );

  useEffect(() => {
    void loadOverview(courseBinSelectionByRubricVersionIdRef.current);
  }, [loadOverview]);

  const updateRowCourseBinSelection = async ({
    rubricVersionId,
    courseBinIds,
  }: {
    rubricVersionId: string;
    courseBinIds: string[];
  }) => {
    if (!backendUrl) return;
    const targetRow = rows.find((row) => row.rubricVersionId === rubricVersionId);
    if (!targetRow) return;

    courseBinSelectionByRubricVersionIdRef.current.set(rubricVersionId, courseBinIds);

    setRows((previousRows) =>
      previousRows.map((row) =>
        row.rubricVersionId === rubricVersionId
          ? {
              ...row,
              selectedCourseBinIds: courseBinIds,
              institutionConsensusRatingsByScaleVersionId: {},
            }
          : row
      )
    );

    const scopeCourseBinIds = courseBinIds.length > 0 ? courseBinIds : undefined;

    let institutionAggregate: ConsensusRatingAggregateResponse | null = null;
    let institutionConsensusRatingsByScaleVersionId: Record<string, number[]> = {};
    let otherInstitutionsAggregate: ConsensusRatingAggregateResponse | null = null;
    let loadError = targetRow.loadError;

    try {
      const { aggregate, error } = await fetchLocalLeaderScaleDistributions({
        backendUrl,
        rubricVersionId,
        courseBinIds: scopeCourseBinIds,
      });
      if (error) {
        loadError = error;
      } else {
        institutionAggregate = aggregate;
        loadError = targetRow.rubricDetail ? null : targetRow.loadError;
      }
    } catch {
      loadError = 'Could not load aggregate';
    }

    try {
      const { aggregate, error } = await fetchLocalLeaderConsensusRatingAggregate({
        backendUrl,
        rubricVersionId,
        courseBinIds: scopeCourseBinIds,
      });
      if (error) {
        loadError = loadError ?? error;
      } else {
        institutionConsensusRatingsByScaleVersionId =
          resolveInstitutionConsensusRatingsByScaleVersionId(aggregate);
      }
    } catch {
      loadError = loadError ?? 'Could not load institution consensus';
      institutionConsensusRatingsByScaleVersionId = {};
    }

    if (shouldCompareAgainstOtherInstitutions) {
      try {
        const { aggregate, error } = await fetchLocalLeaderConsensusRatingAggregate({
          backendUrl,
          rubricVersionId,
          courseBinIds: scopeCourseBinIds,
          compareAgainstOtherInstitutions: true,
        });
        if (error) {
          loadError = loadError ?? error;
        } else {
          otherInstitutionsAggregate = aggregate;
        }
      } catch {
        loadError = loadError ?? 'Could not load comparison aggregate';
      }
    }

    setRows((previousRows) =>
      previousRows.map((row) =>
        row.rubricVersionId === rubricVersionId
          ? {
              ...row,
              institutionAggregate: institutionAggregate ?? row.institutionAggregate,
              institutionConsensusRatingsByScaleVersionId,
              otherInstitutionsAggregate: shouldCompareAgainstOtherInstitutions
                ? (otherInstitutionsAggregate ?? row.otherInstitutionsAggregate)
                : null,
              loadError,
            }
          : row
      )
    );
  };

  if (!backendUrl) {
    return (
      <LocalLeaderAuthGuard>
        <Typography color="error">Backend URL is not configured.</Typography>
      </LocalLeaderAuthGuard>
    );
  }

  return (
    <LocalLeaderAuthGuard>
      <Box sx={{ maxWidth: 1600, mx: 'auto', px: 2, py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            flexWrap: 'wrap',
            mb: 2,
          }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Consensus general overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Consensus rating counts for every active rubric (latest published version of each) for{' '}
              {institutionLabel}.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Each table lists all sections and scales for that rubric version. Primary cells show
              how many submitted user responses at your institution chose ratings 1–4; outlined
              cells mark where your institution&apos;s submitted consensus chose that rating.
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
            <Tooltip
              title={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 0.25 }}>
                  <Typography variant="body2">
                    For your institution, the primary heatmap shows the distribution of submitted
                    user responses (counts and shading per row).
                  </Typography>
                  <Typography variant="body2">
                    Outlined cells on that row indicate ratings your institution chose in submitted
                    local-leader consensus for that scale (even when the response count is zero).
                  </Typography>
                  <Typography variant="body2">
                    For other institutions (when comparison is enabled), the extra rows show
                    submitted local-leader consensus ratings from those institutions.
                  </Typography>
                </Box>
              }
              slotProps={{ tooltip: { sx: { maxWidth: 400 } } }}
            >
              <IconButton size="small" aria-label="How to read this overview">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="When enabled, each rubric also shows a second heatmap for all submitted consensus outside your institution.">
              <FormControlLabel
                control={
                  <Switch
                    checked={shouldCompareAgainstOtherInstitutions}
                    onChange={(_, checked) => setShouldCompareAgainstOtherInstitutions(checked)}
                  />
                }
                label="Compare against other institutions"
                sx={{ m: 0 }}
              />
            </Tooltip>
          </Stack>
        </Box>

        {isLoadingRubrics ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : hasRubricsError ? (
          <Alert severity="error">Could not load rubrics.</Alert>
        ) : null}

        {!isLoadingRubrics && !hasRubricsError && overviewRubrics.length === 0 ? (
          <Alert severity="info">No active rubrics with a published version were found.</Alert>
        ) : null}

        {isLoadingOverview ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : null}

        {!isLoadingOverview
          ? rows.map((row) => (
              <Accordion
                key={row.rubricVersionId}
                defaultExpanded
                disableGutters
                elevation={0}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      gap: 2,
                      width: '100%',
                      pr: 1,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {row.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Latest version: {row.versionNum} · structure and counts use this rubric
                        version snapshot.
                      </Typography>
                    </Box>
                    <Tooltip
                      title={
                        hasCourseBinsError
                          ? 'Could not load course bins.'
                          : 'Optional: limit to General and/or specific course bins at your institution.'
                      }
                    >
                      <Box
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        sx={{
                          flexShrink: 0,
                          width: { xs: '100%', sm: 280 },
                          maxWidth: 320,
                        }}
                      >
                        <Autocomplete
                          multiple
                          disableCloseOnSelect
                          disableClearable
                          size="small"
                          limitTags={1}
                          forcePopupIcon={false}
                          options={courseBinOptions}
                          loading={isLoadingCourseBins}
                          getOptionLabel={(option) => option.label}
                          value={courseBinOptions.filter((bin) =>
                            row.selectedCourseBinIds.includes(bin.id)
                          )}
                          onChange={(_event, value) =>
                            void updateRowCourseBinSelection({
                              rubricVersionId: row.rubricVersionId,
                              courseBinIds: value.map((bin) => bin.id),
                            })
                          }
                          isOptionEqualToValue={(a, b) => a.id === b.id}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Context"
                              placeholder={
                                row.selectedCourseBinIds.length === 0 ? 'All' : undefined
                              }
                              error={hasCourseBinsError}
                            />
                          )}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2, mb: 0 }}>
                  {row.loadError ? (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {row.loadError}
                    </Alert>
                  ) : null}
                  {row.rubricDetail ? (
                    <ConsensusRatingAggregateTable
                      rubric={row.rubricDetail}
                      aggregate={row.institutionAggregate}
                      institutionConsensusRatingsByScaleVersionId={
                        row.institutionConsensusRatingsByScaleVersionId
                      }
                      comparisonAggregate={
                        shouldCompareAgainstOtherInstitutions
                          ? row.otherInstitutionsAggregate
                          : null
                      }
                      comparisonLabel="Other institutions"
                      comparisonPresentation="localLeadEmphasis"
                      showHeatmapLegend={false}
                    />
                  ) : (
                    <Typography color="text.secondary">
                      Could not render scales for this rubric.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          : null}

        {!isLoadingOverview && rows.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            <ConsensusHeatmapLegend
              primaryLabel={
                shouldCompareAgainstOtherInstitutions
                  ? 'Heat scale (per row, your institution)'
                  : 'Heat scale (per row)'
              }
              showComparisonLegend={shouldCompareAgainstOtherInstitutions}
              comparisonLabel="Other institutions"
              showInstitutionConsensusOutlineLegend
            />
          </Box>
        ) : null}

        <Stack direction="row" justifyContent="flex-start" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/local-leader/consensus-meeting')}
          >
            Back to consensus meeting
          </Button>
        </Stack>
      </Box>
    </LocalLeaderAuthGuard>
  );
}
