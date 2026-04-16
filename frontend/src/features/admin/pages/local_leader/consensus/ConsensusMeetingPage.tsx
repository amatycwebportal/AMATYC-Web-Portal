import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchConsensusContexts } from '@utils/hooks/consensus/useFetchConsensusContexts';
import type { ConsensusAssignmentSummary, ConsensusContextStatus } from '@shared/types';
import CircularProgress from '@mui/material/CircularProgress';

export default function ConsensusMeetingPage() {
  const navigate = useNavigate();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
  const { user } = useFetchUser();
  const [selectedRubricId, setSelectedRubricId] = useState('');
  const [selectedContext, setSelectedContext] = useState<ConsensusContextStatus | null>(null);
  const [submittedContextKeys, setSubmittedContextKeys] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState<ConsensusAssignmentSummary | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {
    contexts,
    isLoading: isLoadingContexts,
    hasError: hasContextsError,
  } = useFetchConsensusContexts({ rubricId: selectedRubricId });

  const fetchCompletion = useCallback(async () => {
    if (!backendUrl) return;
    try {
      const res = await fetch(`${backendUrl}/consensus/completion-by-rubric`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        submittedContexts?: { rubricId: string; courseBinId: string | null }[];
      };
      const keys = (data.submittedContexts ?? []).map(
        (context) => `${context.rubricId}:${context.courseBinId ?? 'global'}`
      );
      setSubmittedContextKeys(new Set(keys));
    } catch {
      // non-blocking
    }
  }, [backendUrl]);

  useEffect(() => {
    void fetchCompletion();
  }, [fetchCompletion]);

  const openAssignmentSummary = async () => {
    if (!backendUrl || !selectedRubricId || !selectedContext) return;
    setSummaryError(null);
    setIsLoadingSummary(true);
    try {
      const params = new URLSearchParams({ rubricId: selectedRubricId });
      if (selectedContext.courseBinId) {
        params.set('courseBinId', selectedContext.courseBinId);
      }
      const res = await fetch(`${backendUrl}/consensus/assignment-summary?${params}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setSummaryError(data.error ?? 'Could not load assignment summary');
        return;
      }
      setSummary(data as ConsensusAssignmentSummary);
      setConfirmOpen(true);
    } catch {
      setSummaryError('Could not load assignment summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleProceed = () => {
    if (!summary?.rubricVersionId || !selectedContext) return;
    setConfirmOpen(false);
    const nextParams = new URLSearchParams();
    if (selectedContext.courseBinId) {
      nextParams.set('courseBinId', selectedContext.courseBinId);
    }
    navigate(`/admin/local-leader/consensus-meeting/${summary.rubricVersionId}?${nextParams}`);
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
      <Box sx={{ maxWidth: 720, mx: 'auto', mt: 4, px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Consensus meeting
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose a rubric (latest published version). You will see how many people in your
          institution are assigned or have finished their self-assessment before you open the
          calibration view.
        </Typography>

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
            Select rubric
          </Typography>
          {isLoadingRubrics ? (
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
          ) : hasRubricsError ? (
            <Typography color="error">Could not load rubrics.</Typography>
          ) : (
            <Select
              displayEmpty
              fullWidth
              value={selectedRubricId}
              onChange={(e) => {
                setSelectedRubricId(e.target.value);
                setSelectedContext(null);
              }}
              renderValue={(val) =>
                val ? rubrics?.find((r) => r.id === val)?.title : 'Select a rubric…'
              }
              sx={{ fontSize: 14 }}
            >
              {rubrics?.map((rubric) => (
                <MenuItem key={rubric.id} value={rubric.id}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                    <span>{rubric.title}</span>
                    {contexts.some((context) => context.hasSubmittedConsensus) ||
                    [...submittedContextKeys].some((key) => key.startsWith(`${rubric.id}:`)) ? (
                      <Chip
                        size="small"
                        label="Consensus submitted"
                        color="success"
                        variant="outlined"
                      />
                    ) : null}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>

        {selectedRubricId ? (
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
              Choose context
            </Typography>
            {isLoadingContexts ? (
              <Typography variant="body2" color="text.secondary">
                Loading consensus meetings…
              </Typography>
            ) : hasContextsError ? (
              <Typography variant="body2" color="error">
                Could not load consensus contexts.
              </Typography>
            ) : contexts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No consensus meetings are available for this rubric in your institution.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {contexts.map((context) => {
                  const contextLabel = context.isGlobalContext
                    ? 'Global'
                    : (context.courseBinDisplayName ?? 'Course bin');
                  const isSelected =
                    selectedContext?.courseBinId === context.courseBinId &&
                    selectedContext?.rubricVersionId === context.rubricVersionId;
                  return (
                    <Stack
                      key={`${context.rubricVersionId}:${context.courseBinId ?? 'global'}`}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        border: '1px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        px: 1.5,
                        py: 1,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          variant={isSelected ? 'contained' : 'text'}
                          onClick={() => setSelectedContext(context)}
                        >
                          {contextLabel}
                        </Button>
                        {context.consensusStatus ? (
                          <Chip
                            size="small"
                            label={
                              context.consensusStatus === 'SUBMITTED' ? 'Submitted' : 'Draft saved'
                            }
                            color={context.consensusStatus === 'SUBMITTED' ? 'success' : 'default'}
                            variant="outlined"
                          />
                        ) : null}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {context.predefinedBinName ?? 'Global'}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Box>
        ) : null}

        {summaryError ? (
          <Typography color="error" sx={{ mb: 2 }}>
            {summaryError}
          </Typography>
        ) : null}

        <Button
          variant="contained"
          disabled={!selectedRubricId || !selectedContext || isLoadingSummary}
          onClick={() => void openAssignmentSummary()}
        >
          {isLoadingSummary ? 'Loading…' : 'Continue'}
        </Button>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Proceed with consensus?</DialogTitle>
          <DialogContent>
            {summary ? (
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Members of your institution (latest rubric version):
                </Typography>
                <Typography variant="body1">
                  Total users in institution: <strong>{summary.totalInstitutionUsers}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This count includes you.
                </Typography>
                <Typography variant="body1">
                  Assigned: <strong>{summary.assigned}</strong> · In progress:{' '}
                  <strong>{summary.inProgress}</strong> · Completed self-assessment:{' '}
                  <strong>{summary.completed}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Histograms show submitted self-assessment scores from your institution. You will
                  record separate consensus ratings and justifications.
                </Typography>
                {selectedContext ? (
                  <Typography variant="body2" color="text.secondary">
                    Context:{' '}
                    <strong>
                      {selectedContext.isGlobalContext
                        ? 'Global'
                        : (selectedContext.courseBinDisplayName ?? 'Course bin')}
                    </strong>
                  </Typography>
                ) : null}
              </Stack>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleProceed}>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalLeaderAuthGuard>
  );
}
