import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectLeadAuthGuard } from '../../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import {
  formatInstitutionLabel,
  useFetchInstitutions,
} from '@utils/hooks/institutions/useFetchInstitutions';
import type { ConsensusAssignmentSummary } from '@shared/types';
import { useFetchConsensusContexts } from '@utils/hooks/consensus/useFetchConsensusContexts';
import { PATHWAY_GENERAL_KEY } from '@shared/pathways';
import { pathwayScopeSelectionFromContext } from '@utils/pathwayScope';

export default function ProjectLeadConsensusReviewPage() {
  const navigate = useNavigate();
  const { institutions, isLoadingInstitutions, hasInstitutionsError } = useFetchInstitutions(true);
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();

  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [selectedRubricId, setSelectedRubricId] = useState('');
  const [selectedPathwayScope, setSelectedPathwayScope] = useState<string>('');
  const [rubricIdsWithConsensus, setRubricIdsWithConsensus] = useState<Set<string>>(new Set());
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const {
    rubricVersionId,
    groups,
    isLoading: isLoadingConsensusContexts,
    hasError: hasConsensusContextsError,
  } = useFetchConsensusContexts({
    rubricId: selectedRubricId,
    institutionId: selectedInstitutionId,
  });

  const selectedInstitutionName = useMemo(
    () => {
      const institution = institutions.find((i) => i.id === selectedInstitutionId);
      return institution ? formatInstitutionLabel(institution) : '';
    },
    [institutions, selectedInstitutionId]
  );

  const navigateToGeneralOverview = useCallback(() => {
    navigate('/admin/project-lead/consensus-review/general-overview', {
      state: selectedInstitutionId
        ? {
            institutionId: selectedInstitutionId,
            institutionName: selectedInstitutionName,
          }
        : undefined,
    });
  }, [navigate, selectedInstitutionId, selectedInstitutionName]);

  const fetchCompletion = useCallback(async () => {
    if (!backendUrl || !selectedInstitutionId) {
      setRubricIdsWithConsensus(new Set());
      return;
    }
    try {
      const params = new URLSearchParams({ institutionId: selectedInstitutionId });
      const res = await fetch(`${backendUrl}/consensus/completion-by-rubric?${params}`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as { rubricIdsWithSubmittedConsensus?: string[] };
      const ids = data.rubricIdsWithSubmittedConsensus ?? [];
      setRubricIdsWithConsensus(new Set(ids));
    } catch {
      // non-blocking
    }
  }, [backendUrl, selectedInstitutionId]);

  useEffect(() => {
    void fetchCompletion();
  }, [fetchCompletion]);

  const continueToConsensusReview = async () => {
    if (!backendUrl || !selectedRubricId || !selectedInstitutionId) return;
    setSummaryError(null);
    setIsLoadingSummary(true);
    try {
      const params = new URLSearchParams({
        rubricId: selectedRubricId,
        institutionId: selectedInstitutionId,
      });
      const res = await fetch(`${backendUrl}/consensus/assignment-summary?${params}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setSummaryError(data.error ?? 'Could not load assignment summary');
        return;
      }
      const assignmentSummary = data as ConsensusAssignmentSummary;
      const targetRubricVersionId = assignmentSummary.rubricVersionId ?? rubricVersionId ?? '';
      if (
        rubricVersionId &&
        assignmentSummary.rubricVersionId &&
        rubricVersionId !== assignmentSummary.rubricVersionId
      ) {
        console.warn(
          'ProjectLead consensus review: rubricVersionId mismatch between contexts hook and assignment summary',
          {
            fromContextsHook: rubricVersionId,
            fromAssignmentSummary: assignmentSummary.rubricVersionId,
          }
        );
      }
      if (!targetRubricVersionId) {
        setSummaryError('Could not load assignment summary');
        return;
      }
      const searchParams = new URLSearchParams({
        institutionId: selectedInstitutionId,
      });
      if (selectedPathwayScope) {
        searchParams.set('pathwayId', selectedPathwayScope);
      }
      navigate(
        `/admin/project-lead/consensus-review/${targetRubricVersionId}?${searchParams.toString()}`,
        { state: { institutionName: selectedInstitutionName } }
      );
    } catch {
      setSummaryError('Could not load assignment summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  if (!backendUrl) {
    return (
      <ProjectLeadAuthGuard>
        <Typography color="error">Backend URL is not configured.</Typography>
      </ProjectLeadAuthGuard>
    );
  }

  return (
    <ProjectLeadAuthGuard>
      <Box sx={{ maxWidth: 720, mx: 'auto', mt: 4, px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Review institution consensus
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pick an institution and a rubric, then continue for the standard per-rubric review with
          histograms. Or open General overview for every rubric and scale at once (defaults to all
          institutions with submitted consensus; you can narrow to a subset there).
        </Typography>

        <Stack direction="row" justifyContent="flex-start" sx={{ mb: 3 }}>
          <Button variant="outlined" onClick={navigateToGeneralOverview}>
            General overview
          </Button>
        </Stack>

        <Box
          sx={{
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            p: 3,
            mb: 2,
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: 1, fontSize: 11 }}
          >
            Step 1
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Institution
          </Typography>
          {isLoadingInstitutions ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}
            >
              <CircularProgress />
            </Box>
          ) : hasInstitutionsError ? (
            <Typography color="error">Could not load institutions.</Typography>
          ) : (
            <FormControl fullWidth size="small">
              <InputLabel id="project-lead-consensus-institution-label">Institution</InputLabel>
              <Select
                labelId="project-lead-consensus-institution-label"
                label="Institution"
                value={selectedInstitutionId}
                onChange={(e) => {
                  setSelectedInstitutionId(e.target.value);
                  setSelectedRubricId('');
                  setSelectedPathwayScope('');
                }}
              >
                {institutions.map((row) => (
                  <MenuItem key={row.id} value={row.id}>
                    {formatInstitutionLabel(row)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <Box
          sx={{
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            p: 3,
            mb: 2,
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: 1, fontSize: 11 }}
          >
            Step 2
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Rubric
          </Typography>
          {isLoadingRubrics ? (
            <Typography>Loading rubrics…</Typography>
          ) : hasRubricsError ? (
            <Typography color="error">Could not load rubrics.</Typography>
          ) : (
            <Select
              displayEmpty
              fullWidth
              disabled={!selectedInstitutionId}
              value={selectedRubricId}
              onChange={(e) => {
                setSelectedRubricId(e.target.value);
                setSelectedPathwayScope('');
              }}
              inputProps={{ 'aria-label': 'Rubric' }}
              renderValue={(val) =>
                val ? rubrics?.find((r) => r.id === val)?.title : 'Select a rubric…'
              }
              sx={{ fontSize: 14 }}
            >
              {rubrics?.map((rubric) => (
                <MenuItem key={rubric.id} value={rubric.id}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                    <span>{rubric.title}</span>
                    {selectedInstitutionId && rubricIdsWithConsensus.has(rubric.id) ? (
                      <Typography component="span" variant="caption" color="success.main">
                        Consensus on file
                      </Typography>
                    ) : null}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>

        {selectedInstitutionId && selectedRubricId ? (
          <Box
            sx={{
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              p: 3,
              mb: 2,
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ letterSpacing: 1, fontSize: 11 }}
            >
              Step 3
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
              Pathway context (optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              General is a separate consensus context and is not the same as all pathways.
            </Typography>
            {isLoadingConsensusContexts ? (
              <Typography variant="body2" color="text.secondary">
                Loading consensus contexts…
              </Typography>
            ) : hasConsensusContextsError ? (
              <Typography variant="body2" color="error">
                Could not load consensus contexts for this rubric.
              </Typography>
            ) : groups.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No pathway assignments are configured for this rubric. You can continue without
                selecting a pathway (all contexts).
              </Typography>
            ) : (
              <Stack spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="project-lead-pathway-label">Pathway</InputLabel>
                  <Select
                    labelId="project-lead-pathway-label"
                    label="Pathway"
                    value={selectedPathwayScope}
                    onChange={(e) => {
                      setSelectedPathwayScope(e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>All contexts</em>
                    </MenuItem>
                    {groups.map((group) => {
                      const scopeValue = group.isGeneralPathway
                        ? PATHWAY_GENERAL_KEY
                        : pathwayScopeSelectionFromContext(
                            group.pathwayId,
                            Boolean(group.isGeneralPathway)
                          );
                      return (
                        <MenuItem key={group.pathwayId} value={scopeValue}>
                          {group.pathwayName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {!selectedPathwayScope
                  ? groups
                      .find((group) => group.isGeneralPathway)
                      ?.contexts.some((context) => context.hasSubmittedConsensus) && (
                      <Typography variant="caption" color="text.secondary">
                        General context can be reviewed separately by selecting General above.
                      </Typography>
                    )
                  : null}
              </Stack>
            )}
          </Box>
        ) : null}

        {summaryError ? (
          <Typography color="error" sx={{ mb: 2 }}>
            {summaryError}
          </Typography>
        ) : null}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Button
            variant="contained"
            disabled={!selectedInstitutionId || !selectedRubricId || isLoadingSummary}
            onClick={() => void continueToConsensusReview()}
          >
            {isLoadingSummary ? 'Loading…' : 'Continue'}
          </Button>
        </Stack>
      </Box>
    </ProjectLeadAuthGuard>
  );
}
