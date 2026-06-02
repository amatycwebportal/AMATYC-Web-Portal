import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import type { FilterOptionsState } from '@mui/material/useAutocomplete';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ProjectLeadAuthGuard } from '../../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import {
  formatInstitutionLabel,
  useFetchInstitutions,
} from '@utils/hooks/institutions/useFetchInstitutions';
import type { PredefinedCourseBin, Rubric } from '@shared/types';
import { useFetchAllPredefiendCourseBins } from '@utils/hooks/courseBins/useFetchAllPredefiendCourseBins';
import {
  ConsensusHeatmapLegend,
  ConsensusRatingAggregateTable,
  type ConsensusRatingAggregateResponse,
} from './ConsensusRatingAggregateTable';
import { useConsensusGeneralOverviewHtmlDownload } from './useConsensusGeneralOverviewHtmlDownload';
import { CONSENSUS_OVERVIEW_EXPORT_EXCLUDE_ATTR } from '@utils/export/consensusOverviewExportAttributes';

type OverviewRubricMeta = {
  rubricParentId: string;
  title: string;
  rubricVersionId: string;
  versionNum: number;
};

function getLatestRubricVersionEntry(rubric: Rubric): { id: string; versionNum: number } | null {
  const versions = rubric.versions ?? [];
  if (versions.length === 0) return null;
  return versions.reduce((best, v) => (v.versionNum > best.versionNum ? v : best));
}

type LoadedOverviewRow = OverviewRubricMeta & {
  rubricDetail: Rubric | null;
  aggregate: ConsensusRatingAggregateResponse | null;
  otherInstitutionsAggregate: ConsensusRatingAggregateResponse | null;
  selectedPredefinedBinIds: string[];
  loadError: string | null;
};

type OverviewHubState = {
  institutionId?: string;
  institutionName?: string;
} | null;

const ALL_INSTITUTIONS_SCOPE_ID = '__ALL_WITH_CONSENSUS__';
const GENERAL_PREDEFINED_BIN_KEY = '__general__';

type InstitutionScopeOption = {
  id: string;
  label: string;
};

const allInstitutionsOption: InstitutionScopeOption = {
  id: ALL_INSTITUTIONS_SCOPE_ID,
  label: 'All institutions (submitted consensus, per rubric version)',
};

const generalPredefinedBinOption: PredefinedCourseBin = {
  id: GENERAL_PREDEFINED_BIN_KEY,
  binName: 'General (no course bin)',
};

const institutionFilter = createFilterOptions<InstitutionScopeOption>();

function filterInstitutionScopeOptions(
  institutionOptions: InstitutionScopeOption[],
  params: FilterOptionsState<InstitutionScopeOption>
): InstitutionScopeOption[] {
  const filtered = institutionFilter(institutionOptions, params);
  const input = params.inputValue.toLowerCase().trim();
  const showAll =
    input === '' ||
    allInstitutionsOption.label.toLowerCase().includes(input) ||
    input.includes('all') ||
    input.includes('consensus');
  if (showAll) {
    return [allInstitutionsOption, ...filtered];
  }
  return filtered;
}

async function fetchConsensusRatingAggregate({
  backendUrl,
  rubricVersionId,
  useAllInstitutionsWithConsensus,
  selectedInstitutionIds,
  predefinedBinIds,
  compareAgainstOtherInstitutions,
}: {
  backendUrl: string;
  rubricVersionId: string;
  useAllInstitutionsWithConsensus: boolean;
  selectedInstitutionIds: string[];
  predefinedBinIds?: string[];
  compareAgainstOtherInstitutions?: boolean;
}): Promise<{ aggregate: ConsensusRatingAggregateResponse | null; error: string | null }> {
  const params = new URLSearchParams({ rubricVersionId });
  if (compareAgainstOtherInstitutions) {
    params.set('compareAgainstOtherInstitutions', 'true');
    params.set('institutionIds', selectedInstitutionIds.join(','));
  } else {
    params.set('includePerScoreInstitutions', 'true');
    if (useAllInstitutionsWithConsensus) {
      params.set('allInstitutionsWithConsensus', 'true');
    } else {
      params.set('institutionIds', selectedInstitutionIds.join(','));
    }
  }
  if (predefinedBinIds && predefinedBinIds.length > 0) {
    params.set('predefinedBinIds', predefinedBinIds.join(','));
  }
  const response = await fetch(`${backendUrl}/consensus/consensus-rating-aggregate?${params}`, {
    credentials: 'include',
  });
  const data = (await response.json()) as ConsensusRatingAggregateResponse & { error?: string };
  if (!response.ok) {
    return { aggregate: null, error: data.error ?? 'Could not load aggregate' };
  }
  return { aggregate: data, error: null };
}

export default function ProjectLeadConsensusGeneralOverviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hubState = location.state as OverviewHubState;

  const seedInstitutionId = useMemo(() => {
    const fromQuery = searchParams.get('institutionId')?.trim() ?? '';
    const fromState = hubState?.institutionId?.trim() ?? '';
    return fromQuery || fromState;
  }, [hubState?.institutionId, searchParams]);

  const institutionNameFromHub = hubState?.institutionName?.trim() ?? '';

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { institutions } = useFetchInstitutions(true);
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
  const { predefinedCourseBins, isLoadingPredefinedCourseBins, hasPredefinedCourseBinsError } =
    useFetchAllPredefiendCourseBins();

  const predefinedBinOptions = useMemo(
    (): PredefinedCourseBin[] => [generalPredefinedBinOption, ...(predefinedCourseBins ?? [])],
    [predefinedCourseBins]
  );

  const [useAllInstitutionsWithConsensus, setUseAllInstitutionsWithConsensus] = useState(true);
  const [selectedInstitutionIds, setSelectedInstitutionIds] = useState<string[]>(() =>
    seedInstitutionId ? [seedInstitutionId] : []
  );
  const [rows, setRows] = useState<LoadedOverviewRow[]>([]);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  useEffect(() => {
    if (!seedInstitutionId) return;
    setSelectedInstitutionIds((previous) =>
      previous.includes(seedInstitutionId) ? previous : [...previous, seedInstitutionId]
    );
  }, [seedInstitutionId]);

  const shouldCompareAgainstOtherInstitutions =
    !useAllInstitutionsWithConsensus && selectedInstitutionIds.length > 0;

  const overviewRubrics = useMemo((): OverviewRubricMeta[] => {
    if (!rubrics || rubrics.length === 0) return [];
    const metas: OverviewRubricMeta[] = [];
    for (const r of rubrics) {
      if (!r.active) continue;
      const latest = getLatestRubricVersionEntry(r);
      if (!latest) continue;
      metas.push({
        rubricParentId: r.id,
        title: r.title,
        rubricVersionId: latest.id,
        versionNum: latest.versionNum,
      });
    }
    return metas.sort((a, b) => a.title.localeCompare(b.title));
  }, [rubrics]);

  useEffect(() => {
    if (!backendUrl) return;
    if (!useAllInstitutionsWithConsensus && selectedInstitutionIds.length === 0) {
      setRows([]);
      return;
    }
    if (overviewRubrics.length === 0) {
      setRows([]);
      return;
    }
    setIsLoadingOverview(true);
    let isCancelled = false;
    const loadInitialOverview = async () => {
      try {
        const loaded = await Promise.all(
          overviewRubrics.map(async (meta) => {
            let rubricDetail: Rubric | null = null;
            let aggregate: ConsensusRatingAggregateResponse | null = null;
            let loadError: string | null = null;
            try {
              const detailRes = await fetch(
                `${backendUrl}/rubrics/version/${meta.rubricVersionId}`,
                {
                  credentials: 'include',
                }
              );
              if (detailRes.ok) {
                rubricDetail = (await detailRes.json()) as Rubric;
              } else {
                loadError = 'Could not load rubric structure';
              }
            } catch {
              loadError = 'Could not load rubric structure';
            }
            try {
              const { aggregate: loadedAggregate, error: aggregateError } =
                await fetchConsensusRatingAggregate({
                  backendUrl,
                  rubricVersionId: meta.rubricVersionId,
                  useAllInstitutionsWithConsensus,
                  selectedInstitutionIds,
                });
              if (aggregateError) {
                loadError = loadError ?? aggregateError;
              } else {
                aggregate = loadedAggregate;
              }
            } catch {
              loadError = loadError ?? 'Could not load aggregate';
            }

            let otherInstitutionsAggregate: ConsensusRatingAggregateResponse | null = null;
            if (shouldCompareAgainstOtherInstitutions) {
              try {
                const { aggregate: comparisonAggregate, error: comparisonError } =
                  await fetchConsensusRatingAggregate({
                    backendUrl,
                    rubricVersionId: meta.rubricVersionId,
                    useAllInstitutionsWithConsensus: false,
                    selectedInstitutionIds,
                    compareAgainstOtherInstitutions: true,
                  });
                if (comparisonError) {
                  loadError = loadError ?? comparisonError;
                } else {
                  otherInstitutionsAggregate = comparisonAggregate;
                }
              } catch {
                loadError = loadError ?? 'Could not load comparison aggregate';
              }
            }

            return {
              ...meta,
              rubricDetail,
              aggregate,
              otherInstitutionsAggregate,
              selectedPredefinedBinIds: [],
              loadError,
            };
          })
        );
        if (!isCancelled) {
          setRows(loaded);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingOverview(false);
        }
      }
    };
    void loadInitialOverview();
    return () => {
      isCancelled = true;
    };
  }, [
    backendUrl,
    overviewRubrics,
    selectedInstitutionIds,
    shouldCompareAgainstOtherInstitutions,
    useAllInstitutionsWithConsensus,
  ]);

  const updateRowPredefinedBinSelection = async ({
    rubricVersionId,
    predefinedBinIds,
  }: {
    rubricVersionId: string;
    predefinedBinIds: string[];
  }) => {
    if (!backendUrl) return;
    const targetRow = rows.find((row) => row.rubricVersionId === rubricVersionId);
    if (!targetRow) return;

    setRows((previousRows) =>
      previousRows.map((row) =>
        row.rubricVersionId === rubricVersionId
          ? { ...row, selectedPredefinedBinIds: predefinedBinIds }
          : row
      )
    );

    let aggregate: ConsensusRatingAggregateResponse | null = null;
    let otherInstitutionsAggregate: ConsensusRatingAggregateResponse | null = null;
    let loadError = targetRow.loadError;
    try {
      const { aggregate: loadedAggregate, error: aggregateError } =
        await fetchConsensusRatingAggregate({
          backendUrl,
          rubricVersionId,
          useAllInstitutionsWithConsensus,
          selectedInstitutionIds,
          predefinedBinIds,
        });
      if (aggregateError) {
        loadError = aggregateError;
      } else {
        aggregate = loadedAggregate;
        loadError = targetRow.rubricDetail ? null : targetRow.loadError;
      }
    } catch {
      loadError = 'Could not load aggregate';
    }

    if (shouldCompareAgainstOtherInstitutions) {
      try {
        const { aggregate: comparisonAggregate, error: comparisonError } =
          await fetchConsensusRatingAggregate({
            backendUrl,
            rubricVersionId,
            useAllInstitutionsWithConsensus: false,
            selectedInstitutionIds,
            predefinedBinIds,
            compareAgainstOtherInstitutions: true,
          });
        if (comparisonError) {
          loadError = loadError ?? comparisonError;
        } else {
          otherInstitutionsAggregate = comparisonAggregate;
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
              aggregate: aggregate ?? row.aggregate,
              otherInstitutionsAggregate: shouldCompareAgainstOtherInstitutions
                ? (otherInstitutionsAggregate ?? row.otherInstitutionsAggregate)
                : null,
              loadError,
            }
          : row
      )
    );
  };

  const institutionSelectOptions = useMemo((): InstitutionScopeOption[] => {
    return institutions.map((i) => ({ id: i.id, label: formatInstitutionLabel(i) }));
  }, [institutions]);

  const scopeAutocompleteValue = useMemo((): InstitutionScopeOption[] => {
    if (useAllInstitutionsWithConsensus) {
      return [allInstitutionsOption];
    }
    return selectedInstitutionIds
      .map((id) => institutionSelectOptions.find((o) => o.id === id))
      .filter((o): o is InstitutionScopeOption => Boolean(o));
  }, [useAllInstitutionsWithConsensus, selectedInstitutionIds, institutionSelectOptions]);

  const scopeValueRef = useRef<InstitutionScopeOption[]>(scopeAutocompleteValue);
  const exportRootRef = useRef<HTMLDivElement>(null);

  const institutionScopeSummary = useMemo(() => {
    if (useAllInstitutionsWithConsensus) {
      return allInstitutionsOption.label;
    }
    if (selectedInstitutionIds.length === 0) {
      return 'No institutions selected';
    }
    return scopeAutocompleteValue.map((option) => option.label).join('; ');
  }, [scopeAutocompleteValue, selectedInstitutionIds.length, useAllInstitutionsWithConsensus]);

  const { downloadHtmlButton, htmlDownloadErrorAlert } = useConsensusGeneralOverviewHtmlDownload({
    exportRootRef,
    documentTitle: 'Consensus general overview',
    filenameScopeSlug: 'project-lead',
    isDownloadEnabled:
      !isLoadingOverview &&
      rows.length > 0 &&
      (useAllInstitutionsWithConsensus || selectedInstitutionIds.length > 0),
  });

  useLayoutEffect(() => {
    scopeValueRef.current = scopeAutocompleteValue;
  }, [scopeAutocompleteValue]);

  const handleInstitutionScopeChange = useCallback(
    (_: unknown, newValue: InstitutionScopeOption[]) => {
      const oldV = scopeValueRef.current;
      const oldIdSet = new Set(oldV.map((o) => o.id));
      const added = newValue.filter((o) => !oldIdSet.has(o.id));

      if (added.some((o) => o.id === ALL_INSTITUTIONS_SCOPE_ID)) {
        scopeValueRef.current = [allInstitutionsOption];
        setUseAllInstitutionsWithConsensus(true);
        setSelectedInstitutionIds([]);
        return;
      }

      if (
        oldV.some((o) => o.id === ALL_INSTITUTIONS_SCOPE_ID) &&
        added.length > 0 &&
        !added.some((o) => o.id === ALL_INSTITUTIONS_SCOPE_ID)
      ) {
        const concrete = newValue.filter((o) => o.id !== ALL_INSTITUTIONS_SCOPE_ID);
        scopeValueRef.current = concrete;
        setUseAllInstitutionsWithConsensus(false);
        setSelectedInstitutionIds(concrete.map((o) => o.id));
        return;
      }

      const concrete = newValue.filter((o) => o.id !== ALL_INSTITUTIONS_SCOPE_ID);
      scopeValueRef.current = concrete;
      setUseAllInstitutionsWithConsensus(false);
      setSelectedInstitutionIds(concrete.map((o) => o.id));
    },
    []
  );

  if (!backendUrl) {
    return (
      <ProjectLeadAuthGuard>
        <Typography color="error">Backend URL is not configured.</Typography>
      </ProjectLeadAuthGuard>
    );
  }

  return (
    <ProjectLeadAuthGuard>
      <Box sx={{ maxWidth: 1600, mx: 'auto', px: 2, py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>{downloadHtmlButton}</Box>
        {htmlDownloadErrorAlert}

        <Box ref={exportRootRef}>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              General overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Consensus rating counts for every active rubric (latest published version of each).
              {institutionNameFromHub
                ? ` From the hub you had “${institutionNameFromHub}” ready for subset scope.`
                : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Counts reflect submitted local-leader consensus only. Each table lists all sections
              and scales for that rubric version; cells show how many consensus forms in scope chose
              ratings 0–4. Hover a nonzero count to see which institutions chose that rating for
              that question.
            </Typography>
            {shouldCompareAgainstOtherInstitutions ? (
              <Typography variant="body2" color="text.secondary">
                Comparison against institutions outside your selection is included below.
              </Typography>
            ) : null}
          </Stack>

          <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">Institution scope</Typography>
              <Typography variant="body2" color="text.secondary">
                {institutionScopeSummary}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search and select institutions, or choose the first option to include every
                institution that has submitted consensus for each rubric version (the default).
              </Typography>
              <Box {...{ [CONSENSUS_OVERVIEW_EXPORT_EXCLUDE_ATTR]: true }}>
                <Autocomplete
                  multiple
                  disableClearable
                  forcePopupIcon={false}
                  disableCloseOnSelect
                  size="small"
                  sx={{ maxWidth: 960 }}
                  options={institutionSelectOptions}
                  value={scopeAutocompleteValue}
                  onChange={handleInstitutionScopeChange}
                  filterOptions={(options, params) =>
                    filterInstitutionScopeOptions(options, params)
                  }
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} label="Institutions" placeholder="Search or select…" />
                  )}
                />
              </Box>
              {!useAllInstitutionsWithConsensus && selectedInstitutionIds.length === 0 ? (
                <Alert severity="info">
                  Select one or more institutions to load consensus aggregates.
                </Alert>
              ) : null}
              {shouldCompareAgainstOtherInstitutions ? (
                <Typography variant="body2" color="text.secondary">
                  When one or more institutions are selected, each rubric also shows a comparison
                  heatmap for all submitted consensus outside your selection.
                </Typography>
              ) : null}
            </Stack>
          </Paper>

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
                        <Typography variant="body2" color="text.secondary">
                          Context:{' '}
                          {row.selectedPredefinedBinIds.length === 0
                            ? 'All'
                            : predefinedBinOptions
                                .filter((bin) => row.selectedPredefinedBinIds.includes(bin.id))
                                .map((bin) => bin.binName)
                                .join(', ')}
                        </Typography>
                      </Box>
                      <Tooltip
                        title={
                          hasPredefinedCourseBinsError
                            ? 'Could not load predefined bins.'
                            : 'Optional: include predefined bins and/or General (no course bin).'
                        }
                      >
                        <Box
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          {...{ [CONSENSUS_OVERVIEW_EXPORT_EXCLUDE_ATTR]: true }}
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
                            options={predefinedBinOptions}
                            loading={isLoadingPredefinedCourseBins}
                            getOptionLabel={(option) => option.binName}
                            value={predefinedBinOptions.filter((bin) =>
                              row.selectedPredefinedBinIds.includes(bin.id)
                            )}
                            onChange={(_event, value) =>
                              void updateRowPredefinedBinSelection({
                                rubricVersionId: row.rubricVersionId,
                                predefinedBinIds: value.map((bin) => bin.id),
                              })
                            }
                            isOptionEqualToValue={(a, b) => a.id === b.id}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Context"
                                placeholder={
                                  row.selectedPredefinedBinIds.length === 0 ? 'All' : undefined
                                }
                                error={hasPredefinedCourseBinsError}
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
                        aggregate={row.aggregate}
                        comparisonAggregate={
                          shouldCompareAgainstOtherInstitutions
                            ? row.otherInstitutionsAggregate
                            : null
                        }
                        comparisonLabel="Other institutions"
                        primaryScopeLabel="selected institutions"
                        comparisonPresentation={
                          shouldCompareAgainstOtherInstitutions ? 'localLeadEmphasis' : 'default'
                        }
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
                    ? 'Heat scale (per row, selected institutions)'
                    : 'Heat scale (per row)'
                }
                showComparisonLegend={shouldCompareAgainstOtherInstitutions}
                comparisonLabel="Other institutions"
              />
            </Box>
          ) : null}
        </Box>

        <Stack direction="row" justifyContent="flex-start" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/project-lead/consensus-review')}
            {...{ [CONSENSUS_OVERVIEW_EXPORT_EXCLUDE_ATTR]: true }}
          >
            Back to review hub
          </Button>
        </Stack>
      </Box>
    </ProjectLeadAuthGuard>
  );
}
