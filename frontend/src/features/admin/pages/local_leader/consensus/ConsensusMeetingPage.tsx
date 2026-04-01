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
import type { ConsensusAssignmentSummary } from '@shared/types';

export default function ConsensusMeetingPage() {
  const navigate = useNavigate();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
  const [selectedRubricId, setSelectedRubricId] = useState('');
  const [rubricIdsWithConsensus, setRubricIdsWithConsensus] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState<ConsensusAssignmentSummary | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchCompletion = useCallback(async () => {
    if (!backendUrl) return;
    try {
      const res = await fetch(`${backendUrl}/consensus/completion-by-rubric`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as { rubricIdsWithSubmittedConsensus?: string[] };
      const ids = data.rubricIdsWithSubmittedConsensus ?? [];
      setRubricIdsWithConsensus(new Set(ids));
    } catch {
      // non-blocking
    }
  }, [backendUrl]);

  useEffect(() => {
    void fetchCompletion();
  }, [fetchCompletion]);

  const openAssignmentSummary = async () => {
    if (!backendUrl || !selectedRubricId) return;
    setSummaryError(null);
    setIsLoadingSummary(true);
    try {
      const params = new URLSearchParams({ rubricId: selectedRubricId });
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
    if (!summary?.rubricVersionId) return;
    setConfirmOpen(false);
    navigate(`/admin/local-leader/consensus-meeting/${summary.rubricVersionId}`);
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
            <Typography>Loading rubrics…</Typography>
          ) : hasRubricsError ? (
            <Typography color="error">Could not load rubrics.</Typography>
          ) : (
            <Select
              displayEmpty
              fullWidth
              value={selectedRubricId}
              onChange={(e) => setSelectedRubricId(e.target.value)}
              renderValue={(val) =>
                val ? rubrics?.find((r) => r.id === val)?.title : 'Select a rubric…'
              }
              sx={{ fontSize: 14 }}
            >
              {rubrics?.map((rubric) => (
                <MenuItem key={rubric.id} value={rubric.id}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                    <span>{rubric.title}</span>
                    {rubricIdsWithConsensus.has(rubric.id) ? (
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

        {summaryError ? (
          <Typography color="error" sx={{ mb: 2 }}>
            {summaryError}
          </Typography>
        ) : null}

        <Button
          variant="contained"
          disabled={!selectedRubricId || isLoadingSummary}
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
                <Typography variant="body1">
                  Assigned: <strong>{summary.assigned}</strong> · In progress:{' '}
                  <strong>{summary.inProgress}</strong> · Completed self-assessment:{' '}
                  <strong>{summary.completed}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Histograms show submitted self-assessment scores from your institution. You will
                  record separate consensus ratings and justifications.
                </Typography>
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
