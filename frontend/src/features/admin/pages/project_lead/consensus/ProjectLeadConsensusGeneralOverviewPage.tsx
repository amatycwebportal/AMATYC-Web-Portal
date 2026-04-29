import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
  ConsensusRatingAggregateTable,
  type ConsensusRatingAggregateResponse,
} from './ConsensusRatingAggregateTable';

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
  const [selectedPredefinedBinIds, setSelectedPredefinedBinIds] = useState<string[]>([]);
  const [rows, setRows] = useState<LoadedOverviewRow[]>([]);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  useEffect(() => {
    if (!seedInstitutionId) return;
    setSelectedInstitutionIds((previous) =>
      previous.includes(seedInstitutionId) ? previous : [...previous, seedInstitutionId]
    );
  }, [seedInstitutionId]);

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

  const loadOverview = useCallback(async () => {
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
    try {
      const loaded = await Promise.all(
        overviewRubrics.map(async (meta) => {
          let rubricDetail: Rubric | null = null;
          let aggregate: ConsensusRatingAggregateResponse | null = null;
          let loadError: string | null = null;
          try {
            const detailRes = await fetch(`${backendUrl}/rubrics/version/${meta.rubricVersionId}`, {
              credentials: 'include',
            });
            if (detailRes.ok) {
              rubricDetail = (await detailRes.json()) as Rubric;
            } else {
              loadError = 'Could not load rubric structure';
            }
          } catch {
            loadError = 'Could not load rubric structure';
          }
          try {
            const params = new URLSearchParams({ rubricVersionId: meta.rubricVersionId });
            if (useAllInstitutionsWithConsensus) {
              params.set('allInstitutionsWithConsensus', 'true');
            } else {
              params.set('institutionIds', selectedInstitutionIds.join(','));
            }
            if (selectedPredefinedBinIds.length > 0) {
              params.set('predefinedBinIds', selectedPredefinedBinIds.join(','));
            }
            const aggRes = await fetch(
              `${backendUrl}/consensus/consensus-rating-aggregate?${params}`,
              { credentials: 'include' }
            );
            const aggData = (await aggRes.json()) as ConsensusRatingAggregateResponse & {
              error?: string;
            };
            if (!aggRes.ok) {
              loadError = loadError ?? aggData.error ?? 'Could not load aggregate';
            } else {
              aggregate = aggData;
            }
          } catch {
            loadError = loadError ?? 'Could not load aggregate';
          }
          return { ...meta, rubricDetail, aggregate, loadError };
        })
      );
      setRows(loaded);
    } finally {
      setIsLoadingOverview(false);
    }
  }, [
    backendUrl,
    overviewRubrics,
    selectedInstitutionIds,
    selectedPredefinedBinIds,
    useAllInstitutionsWithConsensus,
  ]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

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
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 2, py: 3 }}>
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
            Counts reflect submitted local-leader consensus only. Each table lists all sections and
            scales for that rubric version; cells show how many consensus forms in scope chose
            ratings 1–4.
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Institution scope</Typography>
            <Typography variant="body2" color="text.secondary">
              Search and select institutions, or choose the first option to include every
              institution that has submitted consensus for each rubric version (the default).
            </Typography>
            <Autocomplete
              multiple
              disableClearable
              forcePopupIcon={false}
              disableCloseOnSelect
              size="small"
              sx={{ maxWidth: 720 }}
              options={institutionSelectOptions}
              value={scopeAutocompleteValue}
              onChange={handleInstitutionScopeChange}
              filterOptions={(options, params) => filterInstitutionScopeOptions(options, params)}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Institutions" placeholder="Search or select…" />
              )}
            />
            {!useAllInstitutionsWithConsensus && selectedInstitutionIds.length === 0 ? (
              <Alert severity="info">
                Select one or more institutions to load consensus aggregates.
              </Alert>
            ) : null}
            <Typography variant="subtitle2">Predefined bin scope (optional)</Typography>
            <Typography variant="body2" color="text.secondary">
              Narrow counts to one or more contexts. Select predefined bin(s), General (no course
              bin), or both. Leave empty to include all contexts.
            </Typography>
            <Autocomplete
              multiple
              disableCloseOnSelect
              disableClearable
              size="small"
              sx={{ maxWidth: 560 }}
              forcePopupIcon={false}
              options={predefinedBinOptions}
              loading={isLoadingPredefinedCourseBins}
              getOptionLabel={(option) => option.binName}
              value={predefinedBinOptions.filter((bin) =>
                selectedPredefinedBinIds.includes(bin.id)
              )}
              onChange={(_event, value) => setSelectedPredefinedBinIds(value.map((b) => b.id))}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Predefined bins"
                  placeholder={selectedPredefinedBinIds.length === 0 ? 'All contexts' : undefined}
                  error={hasPredefinedCourseBinsError}
                  helperText={
                    hasPredefinedCourseBinsError
                      ? 'Could not load predefined bins.'
                      : 'Optional: include predefined bins and/or General (no course bin).'
                  }
                />
              )}
            />
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
              <Paper
                key={row.rubricVersionId}
                elevation={0}
                sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {row.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Latest version: {row.versionNum} · structure and counts use this rubric version
                  snapshot.
                </Typography>
                {row.loadError ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {row.loadError}
                  </Alert>
                ) : null}
                {row.rubricDetail ? (
                  <ConsensusRatingAggregateTable
                    rubric={row.rubricDetail}
                    aggregate={row.aggregate}
                  />
                ) : (
                  <Typography color="text.secondary">
                    Could not render scales for this rubric.
                  </Typography>
                )}
              </Paper>
            ))
          : null}

        <Stack direction="row" justifyContent="flex-start" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/project-lead/consensus-review')}
          >
            Back to review hub
          </Button>
        </Stack>
      </Box>
    </ProjectLeadAuthGuard>
  );
}
