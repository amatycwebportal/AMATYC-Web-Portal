import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import { RubricRow } from '../../../../rubrics/components/ViewAllRubricsTemplateView';
import { useFetchRubricVersion } from '@utils/hooks/rubrics/useFetchRubricVersion';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import type { ConsensusEntry, ConsensusScaleInsight, Response, Rubric } from '@shared/types';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import CircularProgress from '@mui/material/CircularProgress';

type RubricVersionListItem = {
  id: string;
  versionNum: number;
  publishedAt: string;
};

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const PLAIN_YMD_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Start of local calendar day as UTC ISO (for API `submittedFrom`). */
function convertLocalCalendarDayStartToIsoUtc(yyyyMmDd: string): string | null {
  if (!PLAIN_YMD_PATTERN.test(yyyyMmDd.trim())) return null;
  const parts = yyyyMmDd.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();
}

/** End of local calendar day as UTC ISO (for API `submittedTo`). */
function convertLocalCalendarDayEndToIsoUtc(yyyyMmDd: string): string | null {
  if (!PLAIN_YMD_PATTERN.test(yyyyMmDd.trim())) return null;
  const parts = yyyyMmDd.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
}

function createDefaultHistogramEndDate(): string {
  return formatDateForInput(new Date());
}

function createDefaultHistogramStartDate(): string {
  const start = new Date();
  start.setDate(start.getDate() - 90);
  return formatDateForInput(start);
}

function parseConsensusEntriesFromApi(raw: unknown): ConsensusEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(Boolean) as ConsensusEntry[];
}

function formatVersionPublishedLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
}

export default function ConsensusRubricSessionPage() {
  const { rubricVersionId } = useParams<{ rubricVersionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const safeRubricVersionId = rubricVersionId ?? '';
  const courseBinId = searchParams.get('courseBinId') ?? '';

  const { rubricVersion, isLoadingRubricVersion, hasRubricVersionError } =
    useFetchRubricVersion(safeRubricVersionId);
  const { user } = useFetchUser();
  const { courseBins } = useFetchInstitutionCourseBins(user?.institutionId);

  const [responses, setResponses] = useState<Response[]>([]);
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [insightsByScaleId, setInsightsByScaleId] = useState<Record<string, ConsensusScaleInsight>>(
    {}
  );
  const [consensusStatus, setConsensusStatus] = useState<'DRAFT' | 'SUBMITTED' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [rubricVersions, setRubricVersions] = useState<RubricVersionListItem[]>([]);
  const [isLoadingRubricVersions, setIsLoadingRubricVersions] = useState(false);

  /** Empty = no date filter (all submitted responses). Non-empty YYYY-MM-DD sends query params. */
  const [histogramRangeStart, setHistogramRangeStart] = useState(() =>
    createDefaultHistogramStartDate()
  );
  const [histogramRangeEnd, setHistogramRangeEnd] = useState(() => createDefaultHistogramEndDate());

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const userPredefinedBinIdsFromCourseBins = useMemo(
    () =>
      (user?.userCourseBins ?? [])
        .map(
          (userCourseBin) =>
            (courseBins ?? []).find((courseBin) => courseBin.id === userCourseBin.courseBinId)
              ?.predefinedBinId
        )
        .filter((predefinedBinId): predefinedBinId is string => Boolean(predefinedBinId)),
    [user?.userCourseBins, courseBins]
  );

  const noopUpdateRubric = useCallback((_updated: Rubric) => {}, []);

  const respondingContext = useMemo(
    () => ({
      rubricVersionId: safeRubricVersionId,
      userPredefinedBinIds: userPredefinedBinIdsFromCourseBins,
      useFirstAllowedPredefinedBinForNonGlobal: true,
    }),
    [safeRubricVersionId, userPredefinedBinIdsFromCourseBins]
  );

  const rubricParentId = rubricVersion?.id ?? '';

  const loadRubricVersions = useCallback(async () => {
    if (!backendUrl || !rubricParentId) return;
    setIsLoadingRubricVersions(true);
    try {
      const params = new URLSearchParams({ rubricId: rubricParentId });
      const res = await fetch(`${backendUrl}/consensus/rubric-versions?${params}`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as { versions?: RubricVersionListItem[] };
      setRubricVersions(data.versions ?? []);
    } catch {
      setRubricVersions([]);
    } finally {
      setIsLoadingRubricVersions(false);
    }
  }, [backendUrl, rubricParentId]);

  useEffect(() => {
    void loadRubricVersions();
  }, [loadRubricVersions]);

  const HistogramFilterSummary = useMemo(() => {
    const start = histogramRangeStart.trim();
    const end = histogramRangeEnd.trim();
    if (!start && !end) {
      return 'Histogram: all submitted responses (no date filter).';
    }
    if (start && end) {
      return `Histogram: submissions from ${start} through ${end} (your device's local calendar days, by submitted timestamp).`;
    }
    if (start) {
      return `Histogram: submissions on or after ${start} (local calendar date, by submitted timestamp).`;
    }
    return `Histogram: submissions on or before ${end} (local calendar date, by submitted timestamp).`;
  }, [histogramRangeStart, histogramRangeEnd]);

  const loadInsights = useCallback(async () => {
    if (!backendUrl || !safeRubricVersionId) return;
    try {
      const params = new URLSearchParams({ rubricVersionId: safeRubricVersionId });
      params.set('courseBinId', courseBinId);
      const startTrim = histogramRangeStart.trim();
      const endTrim = histogramRangeEnd.trim();
      const fromIso = startTrim ? convertLocalCalendarDayStartToIsoUtc(startTrim) : null;
      const toIso = endTrim ? convertLocalCalendarDayEndToIsoUtc(endTrim) : null;
      if (fromIso) params.set('submittedFrom', fromIso);
      if (toIso) params.set('submittedTo', toIso);

      const res = await fetch(`${backendUrl}/consensus/scale-distributions?${params}`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        byScaleVersionId: Record<string, ConsensusScaleInsight>;
      };
      console.log('data.byScaleVersionId', data.byScaleVersionId);
      setInsightsByScaleId(data.byScaleVersionId ?? {});
    } catch {
      // non-blocking
    }
  }, [backendUrl, safeRubricVersionId, histogramRangeStart, histogramRangeEnd]);

  useEffect(() => {
    void loadInsights();
  }, [loadInsights]);

  const loadMyConsensus = useCallback(async () => {
    if (!backendUrl || !safeRubricVersionId || !user?.id) return;
    try {
      const params = new URLSearchParams({ rubricVersionId: safeRubricVersionId });
      params.set('courseBinId', courseBinId);
      const res = await fetch(`${backendUrl}/consensus/me?${params}`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as {
        consensus: { status: 'DRAFT' | 'SUBMITTED'; entries: unknown } | null;
      };
      if (!data.consensus) {
        setConsensusStatus(null);
        setResponses([]);
        setJustifications({});
        return;
      }
      setConsensusStatus(data.consensus.status);
      const entries = parseConsensusEntriesFromApi(data.consensus.entries);
      setResponses(
        entries.map((e) => ({
          userId: user.id,
          rubricVersionId: safeRubricVersionId,
          scaleVersionId: e.scaleVersionId,
          predefinedBinId: e.predefinedBinId ?? null,
          score: e.score,
        }))
      );
      setJustifications(
        Object.fromEntries(entries.map((e) => [e.scaleVersionId, e.justification ?? '']))
      );
    } catch {
      // non-blocking
    }
  }, [backendUrl, safeRubricVersionId, user?.id]);

  useEffect(() => {
    void loadMyConsensus();
  }, [loadMyConsensus]);

  const availableScales = useMemo(() => rubricVersion?.scales ?? [], [rubricVersion]);

  const visibleScaleIds = useMemo(() => availableScales.map((s) => s.id), [availableScales]);

  const mergedInsightsByScaleId = useMemo(() => {
    const createEmptyInsight = (): ConsensusScaleInsight => ({
      scoreCounts: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
      average: null,
    });
    const merged: Record<string, ConsensusScaleInsight> = { ...insightsByScaleId };
    for (const scale of availableScales) {
      if (!merged[scale.id]) {
        merged[scale.id] = createEmptyInsight();
      }
    }
    return merged;
  }, [availableScales, insightsByScaleId]);

  const isConsensusLocked = consensusStatus === 'SUBMITTED';

  const isReadyToSubmit = useMemo(() => {
    if (!rubricVersion || visibleScaleIds.length === 0) return false;
    return visibleScaleIds.every((scaleId) => {
      const hasScore = responses.some((r) => r.scaleVersionId === scaleId);
      const text = justifications[scaleId]?.trim() ?? '';
      return hasScore && text.length > 0;
    });
  }, [justifications, responses, rubricVersion, visibleScaleIds]);

  const handleJustificationChange = useCallback((scaleVersionId: string, text: string) => {
    setJustifications((previous) => ({ ...previous, [scaleVersionId]: text }));
  }, []);

  const consensusUiPayload = useMemo(
    () => ({
      insightsByScaleId: mergedInsightsByScaleId,
      justifications,
      onJustificationChange: handleJustificationChange,
      isConsensusLocked,
    }),
    [mergedInsightsByScaleId, justifications, handleJustificationChange, isConsensusLocked]
  );

  const handleRubricVersionChange = (event: SelectChangeEvent<string>) => {
    const nextVersionId = event.target.value;
    if (!nextVersionId || nextVersionId === safeRubricVersionId) return;
    const nextParams = new URLSearchParams();
    nextParams.set('courseBinId', courseBinId);
    navigate(`/admin/local-leader/consensus-meeting/${nextVersionId}?${nextParams}`, {
      replace: true,
    });
  };

  const handleClearHistogramDates = () => {
    setHistogramRangeStart('');
    setHistogramRangeEnd('');
  };

  const handleSaveDraft = async () => {
    if (!backendUrl || !user?.id || !safeRubricVersionId) return;
    if (responses.length === 0) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Add at least one rating before saving a draft.',
      });
      return;
    }
    setIsSaving(true);
    try {
      const draftEntries: ConsensusEntry[] = responses.map((r) => ({
        scaleVersionId: r.scaleVersionId,
        predefinedBinId: r.predefinedBinId ?? null,
        score: r.score,
        justification: justifications[r.scaleVersionId] ?? '',
      }));
      const res = await fetch(`${backendUrl}/consensus/save-draft`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rubricVersionId: safeRubricVersionId,
          courseBinId,
          entries: draftEntries,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to save draft');
      }
      setConsensusStatus('DRAFT');
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: 'Consensus draft saved',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save draft';
      snackbarsRef.current?.enqueue({ status: MessageStatus.ERROR, message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!backendUrl || !safeRubricVersionId || !isReadyToSubmit) return;
    setIsSaving(true);
    try {
      const entries: ConsensusEntry[] = visibleScaleIds.map((scaleVersionId) => {
        const row = responses.find((r) => r.scaleVersionId === scaleVersionId);
        if (!row) {
          throw new Error('Missing rating for a criterion');
        }
        return {
          scaleVersionId,
          predefinedBinId: row.predefinedBinId ?? null,
          score: row.score,
          justification: justifications[scaleVersionId] ?? '',
        };
      });
      const res = await fetch(`${backendUrl}/consensus/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rubricVersionId: safeRubricVersionId, courseBinId, entries }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to submit');
      }
      setConsensusStatus('SUBMITTED');
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: 'Consensus submitted',
      });
      navigate('/admin/local-leader/consensus-meeting');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit';
      snackbarsRef.current?.enqueue({ status: MessageStatus.ERROR, message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!rubricVersionId) {
    return (
      <LocalLeaderAuthGuard>
        <Typography>Missing rubric version.</Typography>
      </LocalLeaderAuthGuard>
    );
  }

  if (!backendUrl) {
    return (
      <LocalLeaderAuthGuard>
        <Typography color="error">Backend URL is not configured.</Typography>
      </LocalLeaderAuthGuard>
    );
  }

  if (isLoadingRubricVersion) {
    return (
      <LocalLeaderAuthGuard>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <CircularProgress />
        </Box>
      </LocalLeaderAuthGuard>
    );
  }

  if (hasRubricVersionError || !rubricVersion) {
    return (
      <LocalLeaderAuthGuard>
        <Typography color="error">Could not load this rubric version.</Typography>
      </LocalLeaderAuthGuard>
    );
  }

  if (!user) {
    return (
      <LocalLeaderAuthGuard>
        <Typography>Sign in required.</Typography>
      </LocalLeaderAuthGuard>
    );
  }

  const versionMenuItems =
    rubricVersions.length > 0
      ? rubricVersions
      : (rubricVersion.versions?.map((v) => ({
          id: v.id,
          versionNum: v.versionNum,
          publishedAt: new Date().toISOString(),
        })) ?? []);

  return (
    <LocalLeaderAuthGuard>
      <Box sx={{ maxWidth: 960, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Consensus session
          </Typography>
          <Typography variant="body1">{rubricVersion.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Context:{' '}
            {courseBinId
              ? ((courseBins ?? []).find((bin) => bin.id === courseBinId)?.displayName ??
                'Course bin')
              : 'Global'}
          </Typography>
          {isConsensusLocked ? (
            <Alert severity="info">
              This consensus has been submitted. Ratings and justifications are read-only.
            </Alert>
          ) : null}
        </Stack>

        <Paper elevation={0} sx={{ p: 2, mb: 3, border: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Histogram scope
          </Typography>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ md: 'flex-start' }}
            flexWrap="wrap"
          >
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel id="consensus-rubric-version-label">Rubric version</InputLabel>
              <Select
                labelId="consensus-rubric-version-label"
                label="Rubric version"
                value={safeRubricVersionId}
                onChange={handleRubricVersionChange}
                disabled={isLoadingRubricVersions && versionMenuItems.length === 0}
              >
                {versionMenuItems.map((versionRow) => (
                  <MenuItem key={versionRow.id} value={versionRow.id}>
                    Version {versionRow.versionNum}
                    {versionRow.publishedAt
                      ? ` · published ${formatVersionPublishedLabel(versionRow.publishedAt)}`
                      : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Submitted from"
              type="date"
              size="small"
              value={histogramRangeStart}
              onChange={(event) => setHistogramRangeStart(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              label="Submitted through"
              type="date"
              size="small"
              value={histogramRangeEnd}
              onChange={(event) => setHistogramRangeEnd(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <Button variant="outlined" size="medium" onClick={handleClearHistogramDates}>
              All time
            </Button>
            <Button
              variant="text"
              size="medium"
              onClick={() => {
                setHistogramRangeStart(createDefaultHistogramStartDate());
                setHistogramRangeEnd(createDefaultHistogramEndDate());
              }}
            >
              Last 90 days
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            {HistogramFilterSummary} You see every criterion on this rubric version. For non-global
            criteria, if you are not in a matching course bin, scores are recorded against this
            version&apos;s first allowed bin for that row. Changing version reloads the rubric and
            your saved consensus for that version.
          </Typography>
        </Paper>

        <RubricRow
          rubric={rubricVersion}
          isExpanded={true}
          isEditable={false}
          updateRubricUpdate={noopUpdateRubric}
          isResponding={true}
          setResponses={setResponses}
          responses={responses}
          respondingContext={respondingContext}
          consensusUi={consensusUiPayload}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/local-leader/consensus-meeting')}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            disabled={isConsensusLocked || responses.length === 0 || isSaving}
            onClick={() => void handleSaveDraft()}
          >
            Save draft
          </Button>
          <Button
            variant="contained"
            disabled={!isReadyToSubmit || isConsensusLocked || isSaving}
            onClick={() => void handleSubmit()}
          >
            Submit consensus
          </Button>
        </Stack>
        <ConsecutiveSnackbars ref={snackbarsRef} />
      </Box>
    </LocalLeaderAuthGuard>
  );
}
