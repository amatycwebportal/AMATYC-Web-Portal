import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import {
  formatInstitutionLabel,
  useFetchInstitutions,
} from '@utils/hooks/institutions/useFetchInstitutions';
import type { Rubric } from '@shared/types';
import {
  ConsensusRatingAggregateTable,
  type ConsensusRatingAggregateResponse,
} from '../../project_lead/consensus/ConsensusRatingAggregateTable';

type OverviewRubricMeta = {
  rubricParentId: string;
  title: string;
  rubricVersionId: string;
  versionNum: number;
};

type LoadedOverviewRow = OverviewRubricMeta & {
  rubricDetail: Rubric | null;
  institutionAggregate: ConsensusRatingAggregateResponse | null;
  otherInstitutionsAggregate: ConsensusRatingAggregateResponse | null;
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

export default function LocalLeaderConsensusGeneralOverviewPage() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useFetchUser();
  const { institutions } = useFetchInstitutions(true);
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();

  const [shouldCompareAgainstOtherInstitutions, setShouldCompareAgainstOtherInstitutions] =
    useState(false);
  const [rows, setRows] = useState<LoadedOverviewRow[]>([]);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

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

  const loadOverview = useCallback(async () => {
    if (!backendUrl) return;
    if (overviewRubrics.length === 0) {
      setRows([]);
      return;
    }

    setIsLoadingOverview(true);
    try {
      const loadedRows = await Promise.all(
        overviewRubrics.map(async (meta) => {
          let rubricDetail: Rubric | null = null;
          let institutionAggregate: ConsensusRatingAggregateResponse | null = null;
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
            const institutionParams = new URLSearchParams({
              rubricVersionId: meta.rubricVersionId,
            });
            const institutionAggregateResponse = await fetch(
              `${backendUrl}/consensus/scale-distributions?${institutionParams}`,
              { credentials: 'include' }
            );
            const institutionAggregateData = (await institutionAggregateResponse.json()) as
              | ScaleDistributionResponse
              | { error?: string };
            if (!institutionAggregateResponse.ok) {
              loadError =
                loadError ??
                ('error' in institutionAggregateData
                  ? (institutionAggregateData.error ?? 'Could not load aggregate')
                  : 'Could not load aggregate');
            } else {
              const byScaleVersionId = Object.fromEntries(
                Object.entries(
                  (institutionAggregateData as ScaleDistributionResponse).byScaleVersionId ?? {}
                ).map(([scaleVersionId, insight]) => [
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
              institutionAggregate = {
                byScaleVersionId,
                consensusSubmissionCount,
              };
            }
          } catch {
            loadError = loadError ?? 'Could not load aggregate';
          }

          if (shouldCompareAgainstOtherInstitutions) {
            try {
              const comparisonParams = new URLSearchParams({
                rubricVersionId: meta.rubricVersionId,
                compareAgainstOtherInstitutions: 'true',
              });
              const comparisonResponse = await fetch(
                `${backendUrl}/consensus/local-leader-consensus-rating-aggregate?${comparisonParams}`,
                { credentials: 'include' }
              );
              const comparisonData = (await comparisonResponse.json()) as
                | ConsensusRatingAggregateResponse
                | { error?: string };
              if (!comparisonResponse.ok) {
                loadError =
                  loadError ??
                  ('error' in comparisonData
                    ? (comparisonData.error ?? 'Could not load comparison aggregate')
                    : 'Could not load comparison aggregate');
              } else {
                otherInstitutionsAggregate = comparisonData as ConsensusRatingAggregateResponse;
              }
            } catch {
              loadError = loadError ?? 'Could not load comparison aggregate';
            }
          }

          return {
            ...meta,
            rubricDetail,
            institutionAggregate,
            otherInstitutionsAggregate,
            loadError,
          };
        })
      );
      setRows(loadedRows);
    } finally {
      setIsLoadingOverview(false);
    }
  }, [backendUrl, overviewRubrics, shouldCompareAgainstOtherInstitutions]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  if (!backendUrl) {
    return (
      <LocalLeaderAuthGuard>
        <Typography color="error">Backend URL is not configured.</Typography>
      </LocalLeaderAuthGuard>
    );
  }

  return (
    <LocalLeaderAuthGuard>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Consensus general overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consensus rating counts for every active rubric (latest published version of each) for{' '}
            {institutionLabel}.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Counts reflect submitted local-leader consensus only. Each table lists all sections and
            scales for that rubric version; cells show how many consensus forms in scope chose
            ratings 1–4.
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">How to read this overview</Typography>
            <Typography variant="body2" color="text.secondary">
              For your institution, the heatmap shows the distribution of submitted user responses.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For other institutions (when comparison is enabled), the extra rows show submitted
              local-leader consensus ratings from those institutions.
            </Typography>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Comparison scope</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={shouldCompareAgainstOtherInstitutions}
                  onChange={(_, checked) => setShouldCompareAgainstOtherInstitutions(checked)}
                />
              }
              label="Compare against other institutions"
            />
            <Typography variant="body2" color="text.secondary">
              When enabled, each rubric also shows a second heatmap for all submitted consensus
              outside your institution.
            </Typography>
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
                  Latest version: {row.versionNum} - structure and counts use this rubric version
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
                    aggregate={row.institutionAggregate}
                    comparisonAggregate={
                      shouldCompareAgainstOtherInstitutions ? row.otherInstitutionsAggregate : null
                    }
                    comparisonLabel="Other institutions"
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
            onClick={() => navigate('/admin/local-leader/consensus-meeting')}
          >
            Back to consensus meeting
          </Button>
        </Stack>
      </Box>
    </LocalLeaderAuthGuard>
  );
}
