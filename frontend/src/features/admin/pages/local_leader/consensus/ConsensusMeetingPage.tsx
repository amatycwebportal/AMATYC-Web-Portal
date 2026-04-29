import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import { useFetchConsensusContextsGrouped } from '@utils/hooks/consensus/useFetchConsensusContextsGrouped';
import type { ConsensusRubricContextGroup } from '@utils/hooks/consensus/useFetchConsensusContextsGrouped';
import type { ConsensusAssignmentSummary, ConsensusContextStatus } from '@shared/types';
import CircularProgress from '@mui/material/CircularProgress';

const CONSENSUS_SELECTION_DELIMITER = '###';

function buildConsensusSelectionKey(rubricId: string, courseBinId: string | null) {
  return `${rubricId}${CONSENSUS_SELECTION_DELIMITER}${courseBinId ?? 'general'}`;
}

function findConsensusContextForSelectionKey(
  consensusGroups: ConsensusRubricContextGroup[],
  key: string
): { rubricId: string; context: ConsensusContextStatus } | null {
  const delimiter = CONSENSUS_SELECTION_DELIMITER;
  const index = key.indexOf(delimiter);
  if (index === -1) return null;
  const rubricId = key.slice(0, index);
  const tail = key.slice(index + delimiter.length);
  const normalizedTail = tail === 'global' ? 'general' : tail;
  const courseBinKey = normalizedTail === 'general' ? 'general' : normalizedTail;
  const group = consensusGroups.find((g) => g.rubricId === rubricId);
  if (!group) return null;
  const context = group.contexts.find((c) => (c.courseBinId ?? 'general') === courseBinKey);
  if (!context) return null;
  return { rubricId, context };
}

function getContextDisplayLabel(context: ConsensusContextStatus) {
  if (context.isGeneralContext || context.courseBinId === null) {
    return 'General';
  }
  return context.courseBinDisplayName ?? 'Bin';
}

export default function ConsensusMeetingPage() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('');
  const [submittedContextKeys, setSubmittedContextKeys] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState<ConsensusAssignmentSummary | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {
    groups,
    isLoading: isLoadingGroups,
    hasError: hasGroupsError,
  } = useFetchConsensusContextsGrouped();

  const selection = useMemo(
    () => (selectedKey ? findConsensusContextForSelectionKey(groups, selectedKey) : null),
    [groups, selectedKey]
  );

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
        (context) => `${context.rubricId}:${context.courseBinId ?? 'general'}`
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
    if (!backendUrl || !selection) return;
    const { rubricId, context } = selection;
    setSummaryError(null);
    setIsLoadingSummary(true);
    try {
      const params = new URLSearchParams({ rubricId });
      if (context.courseBinId) {
        params.set('courseBinId', context.courseBinId);
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
    if (!summary?.rubricVersionId || !selection) return;
    setConfirmOpen(false);
    const nextParams = new URLSearchParams();
    if (selection.context.courseBinId) {
      nextParams.set('courseBinId', selection.context.courseBinId);
    }
    navigate(`/admin/local-leader/consensus-meeting/${summary.rubricVersionId}?${nextParams}`);
  };

  const renderSelectValue = (value: unknown) => {
    if (typeof value !== 'string' || value === '') {
      return 'Select rubric and scope…';
    }
    const found = findConsensusContextForSelectionKey(groups, value);
    if (!found) {
      return 'Select rubric and scope…';
    }
    const group = groups.find((g) => g.rubricId === found.rubricId);
    const title = group?.rubricTitle ?? found.rubricId;
    return `${title} — ${getContextDisplayLabel(found.context)}`;
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
          Choose a rubric and meeting scope — <strong>General</strong> or a
          specific bin. You will see how many people in your institution
          are assigned or have finished their self-assessment before you open the calibration view.
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
            Setup
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Select rubric and scope
          </Typography>
          {isLoadingGroups ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : hasGroupsError ? (
            <Typography color="error">Could not load consensus contexts.</Typography>
          ) : groups.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No consensus meetings are available for your institution.
            </Typography>
          ) : (
            <Select
              displayEmpty
              fullWidth
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              renderValue={renderSelectValue}
              inputProps={{ 'aria-label': 'Rubric and meeting scope' }}
              sx={{ fontSize: 14 }}
              MenuProps={{
                autoFocus: false,
                slotProps: { paper: { sx: { maxHeight: 420 } } },
              }}
            >
              <MenuItem value="">
                <em>Select rubric and scope…</em>
              </MenuItem>
              {groups.flatMap((group) => [
                <ListSubheader
                  key={`header-${group.rubricId}`}
                  sx={{ lineHeight: '32px', fontWeight: 600 }}
                >
                  {group.rubricTitle}
                </ListSubheader>,
                ...group.contexts.map((context) => {
                  const optionKey = buildConsensusSelectionKey(group.rubricId, context.courseBinId);
                  const contextLabel = getContextDisplayLabel(context);
                  const completionKey = `${group.rubricId}:${context.courseBinId ?? 'general'}`;
                  const showSubmittedChip =
                    context.hasSubmittedConsensus || submittedContextKeys.has(completionKey);
                  return (
                    <MenuItem key={optionKey} value={optionKey} sx={{ pl: 3 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ width: '100%' }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                          <span>{contextLabel}</span>
                          {context.consensusStatus ? (
                            <Chip
                              size="small"
                              label={
                                context.consensusStatus === 'SUBMITTED'
                                  ? 'Submitted'
                                  : 'Draft saved'
                              }
                              color={
                                context.consensusStatus === 'SUBMITTED' ? 'success' : 'default'
                              }
                              variant="outlined"
                            />
                          ) : null}
                        </Stack>
                      </Stack>
                    </MenuItem>
                  );
                }),
              ])}
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
          disabled={!selection || isLoadingGroups || isLoadingSummary}
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
                {selection ? (
                  <Typography variant="body2" color="text.secondary">
                    Scope: <strong>{getContextDisplayLabel(selection.context)}</strong>
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
