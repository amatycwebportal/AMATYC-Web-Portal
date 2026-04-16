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
import { useFetchInstitutions } from '@utils/hooks/institutions/useFetchInstitutions';
import type { ConsensusAssignmentSummary } from '@shared/types';
import { useFetchConsensusContexts } from '@utils/hooks/consensus/useFetchConsensusContexts';

export default function ProjectLeadConsensusReviewPage() {
  const navigate = useNavigate();
  const { institutions, isLoadingInstitutions, hasInstitutionsError } = useFetchInstitutions(true);
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();

  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [selectedRubricId, setSelectedRubricId] = useState('');
  const [selectedPredefinedBinId, setSelectedPredefinedBinId] = useState<string>('');
  const [selectedCourseBinId, setSelectedCourseBinId] = useState<string>('');
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
    () => institutions.find((i) => i.id === selectedInstitutionId)?.name ?? '',
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
      if (selectedPredefinedBinId) {
        searchParams.set('predefinedBinId', selectedPredefinedBinId);
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
                  setSelectedPredefinedBinId('');
                  setSelectedCourseBinId('');
                }}
              >
                {institutions.map((row) => (
                  <MenuItem key={row.id} value={row.id}>
                    {row.name}
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
                setSelectedPredefinedBinId('');
                setSelectedCourseBinId('');
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
              Predefined bin context (optional)
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
                No course bins are configured for this rubric. You can continue without selecting a
                bin (global context).
              </Typography>
            ) : (
              <Stack spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="project-lead-predefined-bin-label">Predefined bin</InputLabel>
                  <Select
                    labelId="project-lead-predefined-bin-label"
                    label="Predefined bin"
                    value={selectedPredefinedBinId}
                    onChange={(e) => {
                      setSelectedPredefinedBinId(e.target.value);
                      setSelectedCourseBinId('');
                    }}
                  >
                    <MenuItem value="">
                      <em>All bins (global)</em>
                    </MenuItem>
                    {groups
                      .filter((group) => group.predefinedBinId !== null)
                      .map((group) => (
                        <MenuItem
                          key={group.predefinedBinId ?? 'global'}
                          value={group.predefinedBinId ?? ''}
                        >
                          {group.predefinedBinName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {!selectedPredefinedBinId
                  ? groups
                      .find((group) => group.predefinedBinId === null)
                      ?.contexts.some((context) => context.hasSubmittedConsensus) && (
                      <Typography variant="caption" color="text.secondary">
                        Global context has submitted consensus on file.
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
