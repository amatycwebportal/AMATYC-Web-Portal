import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { useCallback, useEffect, useMemo, useState, type SetStateAction } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ProjectLeadAuthGuard } from '../../../Middleware/auth';
import { RubricRow } from '../../../../rubrics/components/ViewAllRubricsTemplateView';
import { useFetchRubricVersion } from '@utils/hooks/rubrics/useFetchRubricVersion';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import type { ConsensusEntry, ConsensusScaleInsight, Response, Rubric } from '@shared/types';

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

function convertLocalCalendarDayStartToIsoUtc(yyyyMmDd: string): string | null {
  if (!PLAIN_YMD_PATTERN.test(yyyyMmDd.trim())) return null;
  const parts = yyyyMmDd.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();
}

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

type InstitutionConsensusRow = {
  userId: string;
  userName: string;
  userEmail: string;
  submittedAt: string | null;
  entries: unknown;
};

export default function ProjectLeadConsensusRubricReviewPage() {
  const { rubricVersionId } = useParams<{ rubricVersionId: string }>();
  const [searchParams] = useSearchParams();
  const institutionId = searchParams.get('institutionId')?.trim() ?? '';
  const predefinedBinId = searchParams.get('predefinedBinId')?.trim() ?? '';
  const navigate = useNavigate();
  const location = useLocation();
  const institutionNameFromNav = (location.state as { institutionName?: string } | null)
    ?.institutionName;

  const safeRubricVersionId = rubricVersionId ?? '';

  const { rubricVersion, isLoadingRubricVersion, hasRubricVersionError } =
    useFetchRubricVersion(safeRubricVersionId);
  const { user } = useFetchUser();

  const [responses, setResponses] = useState<Response[]>([]);
  const [justifications, setJustifications] = useState<Record<string, string>>({});
  const [insightsByScaleId, setInsightsByScaleId] = useState<Record<string, ConsensusScaleInsight>>(
    {}
  );
  const [rubricVersions, setRubricVersions] = useState<RubricVersionListItem[]>([]);
  const [isLoadingRubricVersions, setIsLoadingRubricVersions] = useState(false);
  const [consensusRows, setConsensusRows] = useState<InstitutionConsensusRow[]>([]);
  const [selectedConsensusUserId, setSelectedConsensusUserId] = useState<string>('');

  const [histogramRangeStart, setHistogramRangeStart] = useState(() =>
    createDefaultHistogramStartDate()
  );
  const [histogramRangeEnd, setHistogramRangeEnd] = useState(() => createDefaultHistogramEndDate());

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const rubricParentId = rubricVersion?.id ?? '';

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

  const loadInsights = useCallback(async () => {
    if (!backendUrl || !safeRubricVersionId || !institutionId) return;
    try {
      const params = new URLSearchParams({
        rubricVersionId: safeRubricVersionId,
        institutionId,
      });
      if (predefinedBinId) {
        params.set('predefinedBinId', predefinedBinId);
      }
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
      setInsightsByScaleId(data.byScaleVersionId ?? {});
    } catch {
      // non-blocking
    }
  }, [
    backendUrl,
    histogramRangeEnd,
    histogramRangeStart,
    institutionId,
    predefinedBinId,
    safeRubricVersionId,
  ]);

  useEffect(() => {
    void loadInsights();
  }, [loadInsights]);

  const applyConsensusRow = useCallback(
    (row: InstitutionConsensusRow | undefined) => {
      if (!row) {
        setResponses([]);
        setJustifications({});
        return;
      }
      const entries = parseConsensusEntriesFromApi(row.entries);
      setResponses(
        entries.map((e) => ({
          userId: row.userId,
          rubricVersionId: safeRubricVersionId,
          scaleVersionId: e.scaleVersionId,
          predefinedBinId: e.predefinedBinId ?? null,
          score: e.score,
        }))
      );
      setJustifications(
        Object.fromEntries(entries.map((e) => [e.scaleVersionId, e.justification ?? '']))
      );
    },
    [safeRubricVersionId]
  );

  const loadInstitutionConsensus = useCallback(async () => {
    if (!backendUrl || !safeRubricVersionId || !institutionId) return;
    setConsensusRows([]);
    setSelectedConsensusUserId('');
    try {
      const params = new URLSearchParams({
        rubricVersionId: safeRubricVersionId,
        institutionId,
      });
      if (predefinedBinId) {
        params.set('predefinedBinId', predefinedBinId);
      }
      const res = await fetch(`${backendUrl}/consensus/by-institution?${params}`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as { consensuses?: InstitutionConsensusRow[] };
      const list = data.consensuses ?? [];
      setConsensusRows(list);
      const first = list[0];
      setSelectedConsensusUserId(first?.userId ?? '');
    } catch {
      setConsensusRows([]);
      setSelectedConsensusUserId('');
    }
  }, [backendUrl, institutionId, predefinedBinId, safeRubricVersionId]);

  useEffect(() => {
    void loadInstitutionConsensus();
  }, [loadInstitutionConsensus]);

  useEffect(() => {
    const row = consensusRows.find((r) => r.userId === selectedConsensusUserId);
    applyConsensusRow(row);
  }, [applyConsensusRow, consensusRows, selectedConsensusUserId]);

  const availableScales = useMemo(() => rubricVersion?.scales ?? [], [rubricVersion]);

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

  const noopUpdateRubric = useCallback((_r: Rubric) => {}, []);
  const noopSetResponses = useCallback((_action: SetStateAction<Response[]>) => {}, []);
  const noopJustificationChange = useCallback((_scaleVersionId: string, _text: string) => {}, []);
  const plRespondingContext = useMemo(
    () => ({
      rubricVersionId: safeRubricVersionId,
      userPredefinedBinIds: [] as string[],
      useFirstAllowedPredefinedBinForNonGlobal: true,
    }),
    [safeRubricVersionId]
  );
  const projectLeadConsensusUi = useMemo(
    () => ({
      insightsByScaleId: mergedInsightsByScaleId,
      justifications,
      onJustificationChange: noopJustificationChange,
      isConsensusLocked: true as const,
    }),
    [mergedInsightsByScaleId, justifications, noopJustificationChange]
  );

  const handleRubricVersionChange = (event: SelectChangeEvent<string>) => {
    const nextVersionId = event.target.value;
    if (!nextVersionId || !institutionId || nextVersionId === safeRubricVersionId) return;
    navigate(
      `/admin/project-lead/consensus-review/${nextVersionId}?institutionId=${encodeURIComponent(institutionId)}${
        predefinedBinId ? `&predefinedBinId=${encodeURIComponent(predefinedBinId)}` : ''
      }`,
      { replace: true, state: { institutionName: institutionNameFromNav } }
    );
  };

  const handleClearHistogramDates = () => {
    setHistogramRangeStart('');
    setHistogramRangeEnd('');
  };

  if (!rubricVersionId) {
    return (
      <ProjectLeadAuthGuard>
        <Typography>Missing rubric version.</Typography>
      </ProjectLeadAuthGuard>
    );
  }

  if (!institutionId) {
    return (
      <ProjectLeadAuthGuard>
        <Alert severity="warning" sx={{ maxWidth: 560, mx: 'auto', mt: 4 }}>
          Select an institution from the review hub.{' '}
          <Button onClick={() => navigate('/admin/project-lead/consensus-review')}>
            Back to institution & rubric
          </Button>
        </Alert>
      </ProjectLeadAuthGuard>
    );
  }

  if (!backendUrl) {
    return (
      <ProjectLeadAuthGuard>
        <Typography color="error">Backend URL is not configured.</Typography>
      </ProjectLeadAuthGuard>
    );
  }

  if (isLoadingRubricVersion) {
    return (
      <ProjectLeadAuthGuard>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <CircularProgress />
        </Box>
      </ProjectLeadAuthGuard>
    );
  }

  if (hasRubricVersionError || !rubricVersion) {
    return (
      <ProjectLeadAuthGuard>
        <Typography color="error">Could not load this rubric version.</Typography>
      </ProjectLeadAuthGuard>
    );
  }

  if (!user) {
    return (
      <ProjectLeadAuthGuard>
        <Typography>Sign in required.</Typography>
      </ProjectLeadAuthGuard>
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

  const institutionHeading =
    institutionNameFromNav && institutionNameFromNav.length > 0
      ? institutionNameFromNav
      : `Institution ${institutionId}`;

  return (
    <ProjectLeadAuthGuard>
      <Box sx={{ maxWidth: 960, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Consensus review
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {institutionHeading}
          </Typography>
          <Typography variant="body1">{rubricVersion.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Predefined bin: {predefinedBinId || 'All bins (global)'}
          </Typography>
          {consensusRows.length === 0 ? (
            <Alert severity="info">
              No submitted consensus is on file for this institution and rubric version.
            </Alert>
          ) : consensusRows.length > 1 ? (
            <FormControl size="small" sx={{ maxWidth: 420 }}>
              <InputLabel id="pl-consensus-user-label">Submitted by</InputLabel>
              <Select
                labelId="pl-consensus-user-label"
                label="Submitted by"
                value={selectedConsensusUserId}
                onChange={(e) => setSelectedConsensusUserId(e.target.value)}
              >
                {consensusRows.map((row) => (
                  <MenuItem key={row.userId} value={row.userId}>
                    {row.userName || row.userEmail || row.userId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
          <Alert severity="info">
            Read-only: project lead review (consensus cannot be edited here).
          </Alert>
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
              <InputLabel id="pl-consensus-rv-label">Rubric version</InputLabel>
              <Select
                labelId="pl-consensus-rv-label"
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
            {HistogramFilterSummary} Histograms use self-assessments from this institution only.
          </Typography>
        </Paper>

        <RubricRow
          rubric={rubricVersion}
          isExpanded={true}
          isEditable={false}
          updateRubricUpdate={noopUpdateRubric}
          isResponding={true}
          setResponses={noopSetResponses}
          responses={responses}
          respondingContext={plRespondingContext}
          consensusUi={projectLeadConsensusUi}
        />

        <Stack direction="row" justifyContent="flex-start" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/project-lead/consensus-review')}
          >
            Back
          </Button>
        </Stack>
      </Box>
    </ProjectLeadAuthGuard>
  );
}
