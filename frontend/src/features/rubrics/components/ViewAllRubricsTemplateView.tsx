import { memo, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { ExpandLess, ExpandMore, Add, Public, DeleteOutline } from '@mui/icons-material';
import { PredefinedCourseBin, Rubric, RubricScale } from '@shared/types';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { TPSE_COLORS } from '@theme/themePrimitives';
import { alpha } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { EditableText } from '@utils/components/EditableText';
import type { ConsensusScaleInsight, Response } from '@shared/types';
import { useFetchAllPredefiendCourseBins } from '@utils/hooks/courseBins/useFetchAllPredefiendCourseBins';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
const LEVEL_LABELS = [
  '(0) Baseline',
  '(1) Beginning',
  '(2) Developing',
  '(3) Accomplished',
  '(4) Exemplar',
] as const;

const HISTOGRAM_SCORES = [0, 1, 2, 3, 4] as const;

const CONSENSUS_HISTOGRAM_MAX_BAR_PX = 56;
const CONSENSUS_HISTOGRAM_MIN_BAR_PX = 3;

/** API JSON may use string keys for score slots; normalize to numeric counts 0–4. */
function getConsensusScoreCount(
  scoreCounts: ConsensusScaleInsight['scoreCounts'],
  score: number
): number {
  const raw = scoreCounts as Record<string | number, unknown>;
  const value = raw[score] ?? raw[String(score)];
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

const ConsensusScoreHistogram = memo(function ConsensusScoreHistogram({
  insight,
}: {
  insight: ConsensusScaleInsight;
}) {
  const counts = HISTOGRAM_SCORES.map((score) =>
    getConsensusScoreCount(insight.scoreCounts, score)
  );
  const maxCount = Math.max(...counts, 1);
  const totalResponses = counts.reduce((accumulator, value) => accumulator + value, 0);

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderBottom: 'none',
        px: 2,
        py: 1.5,
        bgcolor: 'action.hover',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Institution responses (submitted self-assessments) — count per score
      </Typography>
      {totalResponses === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          No submitted self-assessments for this rubric version from members of your institution
          yet. Histograms update after faculty submit scores (draft responses are not included).
        </Typography>
      ) : (
        <Stack
          direction="row"
          alignItems="flex-end"
          spacing={1}
          sx={{ minHeight: CONSENSUS_HISTOGRAM_MAX_BAR_PX + 24 }}
        >
          {HISTOGRAM_SCORES.map((score, index) => {
            const count = counts[index] ?? 0;
            const barHeightPx =
              count === 0
                ? CONSENSUS_HISTOGRAM_MIN_BAR_PX
                : Math.max(
                    CONSENSUS_HISTOGRAM_MIN_BAR_PX,
                    (count / maxCount) * CONSENSUS_HISTOGRAM_MAX_BAR_PX
                  );
            return (
              <Box
                key={score}
                sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 48,
                    height: CONSENSUS_HISTOGRAM_MAX_BAR_PX,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '70%',
                      height: barHeightPx,
                      flexShrink: 0,
                      bgcolor: TPSE_COLORS.primary.blue,
                      borderRadius: 0.5,
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {score}: {count}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        Average score:{' '}
        <strong>{insight.average === null ? '—' : insight.average.toFixed(2)}</strong>
      </Typography>
    </Box>
  );
});

function getLevelRows(scale: RubricScale) {
  if (!scale.levelDescriptions) return [];
  return Object.entries(scale.levelDescriptions)
    .map(([score, value]) => ({
      score: Number(score),
      label: value.label,
      description: value.description,
    }))
    .sort((a, b) => a.score - b.score);
}

// Groups scales by their section field
function groupBySection(scales: RubricScale[]): { section: string; scales: RubricScale[] }[] {
  const map = new Map<string, RubricScale[]>();
  for (const scale of scales) {
    const key = scale.section ?? 'General';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(scale);
  }
  return Array.from(map.entries()).map(([section, scales]) => ({ section, scales }));
}

function isScaleSelectedForResponse(
  scaleVersionId: string,
  levelScore: number,
  responses: Response[]
): boolean {
  return responses.some(
    (response) => response.scaleVersionId === scaleVersionId && response.score === levelScore
  );
}

function getSelectedPredefinedBinId(
  scale: RubricScale,
  userPredefinedBinIds: string[]
): string | undefined {
  if (scale.isGlobal) return undefined;
  const allowedBinIds = scale.binIds ?? [];
  return allowedBinIds.find((binId) => userPredefinedBinIds.includes(binId));
}

function resolvePredefinedBinIdForResponse(
  scale: RubricScale,
  userPredefinedBinIds: string[],
  useFirstAllowedPredefinedBinForNonGlobal: boolean
): string | undefined {
  if (scale.isGlobal) return undefined;
  const fromUserCourseBins = getSelectedPredefinedBinId(scale, userPredefinedBinIds);
  if (fromUserCourseBins) return fromUserCourseBins;
  if (useFirstAllowedPredefinedBinForNonGlobal) {
    const firstAllowed = scale.binIds?.[0];
    return firstAllowed;
  }
  return undefined;
}

export type RubricRespondingContext = {
  rubricVersionId: string;
  userPredefinedBinIds: string[];
  /** When set (e.g. local leader consensus), use the scale's first allowed bin if the user has no matching course bin. */
  useFirstAllowedPredefinedBinForNonGlobal?: boolean;
};

const handleSelect = (
  scale: RubricScale,
  scaleVersionId: string,
  levelScore: number,
  setResponses: React.Dispatch<React.SetStateAction<Response[]>>,
  rubricVersionId: string,
  userPredefinedBinIds: string[],
  useFirstAllowedPredefinedBinForNonGlobal = false
) => {
  const predefinedBinId = resolvePredefinedBinIdForResponse(
    scale,
    userPredefinedBinIds,
    useFirstAllowedPredefinedBinForNonGlobal
  );
  setResponses((prev) => {
    const prior = prev.find((s) => s.scaleVersionId === scaleVersionId);
    return [
      ...prev.filter((s) => s.scaleVersionId !== scaleVersionId),
      {
        scaleVersionId,
        score: levelScore,
        rubricVersionId,
        ...(predefinedBinId ? { predefinedBinId } : {}),
        ...(prior?.justification !== undefined ? { justification: prior.justification } : {}),
      } as Response,
    ];
  });
};

// ── Scale row: criterion title + description + 5-column scoring table ────────
export const ScaleCard = memo(function ScaleCard({
  rubric,
  scale,
  isEditable,
  updateRubricUpdate,
  isResponding,
  setResponses,
  responses,
  respondingContext,
  consensusInsight,
  isConsensusMode = false,
  consensusJustification = '',
  onConsensusJustificationChange,
  isConsensusLocked = false,
  onMoveScaleToGraveyard,
}: {
  rubric: Rubric;
  scale: RubricScale;
  isEditable: boolean;
  updateRubricUpdate: (updatedRubric: Rubric) => void;
  isResponding: boolean;
  setResponses: React.Dispatch<React.SetStateAction<Response[]>>;
  responses: Response[];
  respondingContext?: RubricRespondingContext;
  consensusInsight?: ConsensusScaleInsight;
  isConsensusMode?: boolean;
  consensusJustification?: string;
  /** Stable across renders (same ref); first arg must be this row’s `scale.id`. */
  onConsensusJustificationChange?: (scaleVersionId: string, text: string) => void;
  isConsensusLocked?: boolean;
  onMoveScaleToGraveyard?: (scaleId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const levelRows = getLevelRows(scale);
  const { predefinedCourseBins } = useFetchAllPredefiendCourseBins();
  const responseForScale = responses.find((r) => r.scaleVersionId === scale.id);
  return (
    <Box sx={{ mb: 3 }}>
      {/* Criterion header */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderBottom: 'none',
          p: 1.5,
          // bgcolor: 'grey.50',
        }}
      >
        <EditableText
          value={scale.prompt}
          onChange={(newPrompt: string) =>
            updateRubricUpdate({
              ...rubric,
              scales: rubric.scales?.map((s) =>
                s.id === scale.id ? { ...s, prompt: newPrompt } : s
              ),
            })
          }
          isEditable={isEditable}
          multiline={true}
          typographyProps={{ variant: 'body1', color: 'text.secondary' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Bins:</strong>
            </Typography>

            {scale.isGlobal && <Chip label="Global" variant="outlined" color="primary" />}
            {scale.binIds?.map((binId) => (
              <Chip
                key={binId}
                label={predefinedCourseBins?.find((bin) => bin.id === binId)?.binName ?? ''}
                variant="outlined"
                color="primary"
                onDelete={
                  isEditable
                    ? () => {
                        updateRubricUpdate({
                          ...rubric,
                          scales: rubric.scales?.map((s) =>
                            s.id === scale.id
                              ? { ...s, binIds: s.binIds?.filter((id) => id !== binId) }
                              : s
                          ),
                        });
                      }
                    : undefined
                }
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {isEditable && (
              <Chip
                variant="outlined"
                color="primary"
                label="Add Bin"
                onClick={() => setOpen(true)}
                icon={<Add />}
              />
            )}

            {isEditable && (
              <Chip
                variant="outlined"
                color="primary"
                label="Make Global"
                onClick={() =>
                  updateRubricUpdate({
                    ...rubric,
                    scales: rubric.scales?.map((s) =>
                      s.id === scale.id ? { ...s, isGlobal: !s.isGlobal } : s
                    ),
                  })
                }
                icon={<Public />}
              />
            )}
            {isEditable && onMoveScaleToGraveyard && (
              <Chip
                variant="outlined"
                color="error"
                label="Move to Graveyard"
                onClick={() => onMoveScaleToGraveyard(scale.id)}
                icon={<DeleteOutline />}
              />
            )}
          </Box>
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add Bin</DialogTitle>
          <DialogContent>
            <Autocomplete
              options={predefinedCourseBins ?? ([] as PredefinedCourseBin[])}
              getOptionLabel={(option) => option.binName}
              onChange={(_event, value) =>
                updateRubricUpdate({
                  ...rubric,
                  scales: rubric.scales?.map((s) =>
                    s.id === scale.id ? { ...s, binIds: [...(s.binIds ?? []), value?.id ?? ''] } : s
                  ),
                })
              }
              renderInput={(params) => <TextField {...params} label="Predefined Course Bin" />}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={() => setOpen(false)}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {consensusInsight ? <ConsensusScoreHistogram insight={consensusInsight} /> : null}
      {/* Scoring table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider' }}
      >
        <Table size="small" aria-label={`Scoring levels for criterion`}>
          <TableHead>
            <TableRow>
              {LEVEL_LABELS.map((label) => (
                <TableCell
                  key={label}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    // bgcolor: 'grey.100',
                    borderRight: '1px solid',
                    borderRightColor: 'divider',
                    width: '20%',
                    verticalAlign: 'top',
                    '&:last-child': { borderRight: 'none' },
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              {levelRows.length > 0
                ? levelRows.map((level) => {
                    const isLevelSelected = isScaleSelectedForResponse(
                      scale.id,
                      level.score,
                      responses
                    );
                    return (
                      <TableCell
                        key={level.score}
                        sx={{
                          fontSize: '0.75rem',
                          verticalAlign: 'top',
                          borderRight: '1px solid',
                          borderRightColor: 'divider',
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          lineHeight: 1.5,
                          '&:last-child': { borderRight: 'none' },
                          cursor:
                            isResponding && respondingContext && !isConsensusLocked
                              ? 'pointer'
                              : 'default',
                          transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
                          ...(isLevelSelected && {
                            bgcolor: alpha(TPSE_COLORS.primary.blue, 0.16),
                            boxShadow: `inset 0 0 0 3px ${TPSE_COLORS.primary.blue}`,
                            position: 'relative',
                            zIndex: 1,
                          }),
                        }}
                        onClick={() => {
                          if (isResponding && respondingContext && !isConsensusLocked) {
                            handleSelect(
                              scale,
                              scale.id,
                              level.score,
                              setResponses,
                              respondingContext.rubricVersionId,
                              respondingContext.userPredefinedBinIds,
                              respondingContext.useFirstAllowedPredefinedBinForNonGlobal ?? false
                            );
                          }
                        }}
                      >
                        <EditableText
                          value={level.description}
                          onChange={(newDescription: string) =>
                            updateRubricUpdate({
                              ...rubric,
                              scales: rubric.scales?.map((s) =>
                                s.id === scale.id
                                  ? {
                                      ...s,
                                      levelDescriptions: {
                                        ...(s.levelDescriptions ?? {}),
                                        [level.score]: {
                                          label: level.label,
                                          description: newDescription,
                                        },
                                      },
                                    }
                                  : s
                              ),
                            })
                          }
                          isEditable={isEditable}
                          multiline={true}
                          typographyProps={{ variant: 'body1', color: 'text.secondary' }}
                        />
                      </TableCell>
                    );
                  })
                : // No level descriptions yet — show empty cells
                  LEVEL_LABELS.map((label) => (
                    <TableCell
                      key={label}
                      sx={{
                        fontSize: '0.75rem',
                        color: 'text.disabled',
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
                        '&:last-child': { borderRight: 'none' },
                      }}
                    >
                      —
                    </TableCell>
                  ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Justification row */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderTop: 'none',
          p: isConsensusMode ? 1.5 : 1,
          overflow: 'hidden',
          minHeight: '100px',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          component="div"
          sx={{ mb: isConsensusMode ? 1 : 0 }}
        >
          <strong>Justification for Rating:</strong>
        </Typography>
        {isConsensusMode && onConsensusJustificationChange ? (
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={3}
            value={consensusJustification}
            onChange={(event) => onConsensusJustificationChange(scale.id, event.target.value)}
            disabled={isConsensusLocked}
            placeholder="Explain your consensus rating for this criterion."
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '.875rem',
                lineHeight: 0.9,
              },
            }}
          />
        ) : isResponding && respondingContext && !isConsensusMode ? (
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={3}
            value={responseForScale?.justification ?? ''}
            onChange={(event) => {
              const text = event.target.value;
              setResponses((prev) => {
                const target = prev.find((r) => r.scaleVersionId === scale.id);
                if (!target) return prev;
                return prev.map((r) =>
                  r.scaleVersionId === scale.id ? { ...r, justification: text } : r
                );
              });
            }}
            disabled={!responseForScale}
            placeholder={
              responseForScale
                ? 'Optional: explain your rating for this criterion.'
                : 'Select a rating above to add an optional justification.'
            }
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '.875rem',
                lineHeight: 0.9,
              },
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
});

// ── Section block: header + its scales ───────────────────────────────────────
export type RubricConsensusUi = {
  insightsByScaleId: Record<string, ConsensusScaleInsight>;
  justifications: Record<string, string>;
  onJustificationChange: (scaleVersionId: string, text: string) => void;
  isConsensusLocked: boolean;
};

export function SectionBlock({
  rubric,
  section,
  scales,
  isEditable,
  updateRubricUpdate,
  isResponding,
  setResponses,
  responses,
  respondingContext,
  consensusUi,
  onAddScaleToSection,
  onMoveScaleToGraveyard,
}: {
  rubric: Rubric;
  section: string;
  scales: RubricScale[];
  isEditable: boolean;
  updateRubricUpdate: (updatedRubric: Rubric) => void;
  isResponding: boolean;
  setResponses: React.Dispatch<React.SetStateAction<Response[]>>;
  responses: Response[];
  respondingContext?: RubricRespondingContext;
  consensusUi?: RubricConsensusUi;
  onAddScaleToSection?: (sectionName: string) => void;
  onMoveScaleToGraveyard?: (scaleId: string) => void;
}) {
  const userPredefinedBinIds = respondingContext?.userPredefinedBinIds ?? [];
  const routeConsensusJustificationChange = useCallback(
    (scaleVersionId: string, text: string) => {
      consensusUi?.onJustificationChange(scaleVersionId, text);
    },
    [consensusUi]
  );
  const shouldShowScaleForUser = (scale: RubricScale): boolean => {
    if (!isResponding) return true;
    if (consensusUi) return true;
    if (respondingContext?.useFirstAllowedPredefinedBinForNonGlobal) return true;
    if (scale.isGlobal) return true;
    const scaleBinIds = scale.binIds ?? [];
    return scaleBinIds.some((binId) => userPredefinedBinIds.includes(binId));
  };
  const scalesToShow = scales.filter((scale) => shouldShowScaleForUser(scale));

  return (
    <Box sx={{ mb: 3 }}>
      {/* Section header — matches the bold section banners in the template */}
      <Box
        sx={{
          bgcolor: TPSE_COLORS.primary.ember_green,
          color: 'common.white',
          px: 2,
          py: 1,
          mb: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Box width="100%">
            <EditableText
              value={section.toUpperCase()}
              onChange={(newSection: string) =>
                updateRubricUpdate({
                  ...rubric,
                  scales: rubric.scales?.map((s) =>
                    s.section === section ? { ...s, section: newSection } : s
                  ),
                })
              }
              isEditable={isEditable}
              multiline={true}
              typographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
            />
          </Box>
          {isEditable && onAddScaleToSection && (
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              onClick={() => onAddScaleToSection(section)}
              startIcon={<Add />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add Scale
            </Button>
          )}
        </Stack>
      </Box>
      {scalesToShow.length > 0 ? (
        scalesToShow.map((scale) => (
          <ScaleCard
            key={scale.id}
            rubric={rubric}
            scale={scale}
            isEditable={isEditable}
            updateRubricUpdate={updateRubricUpdate}
            isResponding={isResponding}
            setResponses={setResponses}
            responses={responses}
            respondingContext={respondingContext}
            consensusInsight={consensusUi?.insightsByScaleId[scale.id]}
            isConsensusMode={Boolean(consensusUi)}
            consensusJustification={consensusUi?.justifications[scale.id] ?? ''}
            onConsensusJustificationChange={
              consensusUi ? routeConsensusJustificationChange : undefined
            }
            isConsensusLocked={consensusUi?.isConsensusLocked ?? false}
            onMoveScaleToGraveyard={onMoveScaleToGraveyard}
          />
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No scales to complete for this section
        </Typography>
      )}
    </Box>
  );
}

// ── Rubric accordion row ──────────────────────────────────────────────────────
type RubricRowProps = {
  rubric: Rubric;
  isExpanded: boolean;
  onToggle?: () => void;
  isEditable: boolean;
  updateRubricUpdate: (updatedRubric: Rubric) => void;
  isResponding?: boolean;
  setResponses?: React.Dispatch<React.SetStateAction<Response[]>>;
  responses?: Response[];
  respondingContext?: RubricRespondingContext;
  consensusUi?: RubricConsensusUi;
  onAddSection?: () => void;
  onAddScaleToSection?: (sectionName: string) => void;
  onMoveScaleToGraveyard?: (scaleId: string) => void;
};

export const RubricRow = memo(function RubricRow({
  rubric,
  isExpanded,
  onToggle,
  isEditable,
  updateRubricUpdate,
  isResponding,
  setResponses,
  responses,
  respondingContext,
  consensusUi,
  onAddSection,
  onAddScaleToSection,
  onMoveScaleToGraveyard,
}: RubricRowProps) {
  const sections = groupBySection(rubric.scales ?? ([] as RubricScale[]));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isProjectLead = pathname.includes('/admin/project-lead');
  return (
    <Box
      sx={{
        mb: 2,
        border: '1px solid',
        borderColor: isExpanded ? 'primary.main' : 'divider',
        borderRadius: 1,
      }}
    >
      {/* Rubric title bar */}
      <Paper
        elevation={0}
        onClick={isResponding ? undefined : onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          border: '1px solid',
          borderColor: isExpanded ? 'divider' : TPSE_COLORS.primary.blue,
          borderRadius: 1,
          cursor: isResponding ? 'default' : 'pointer',
          bgcolor: isExpanded ? 'primary.50' : 'background.paper',
          ...(!isResponding && { '&:hover': { bgcolor: 'action.hover' } }),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
          {!isEditable && !isResponding && onToggle && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              aria-label={isExpanded ? 'Collapse rubric' : 'Expand rubric'}
            >
              {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          )}

          <Box sx={{ width: '100%' }}>
            <EditableText
              value={rubric.title}
              onChange={(newTitle: string) => updateRubricUpdate({ ...rubric, title: newTitle })}
              isEditable={isEditable}
              multiline={true}
              typographyProps={{ variant: 'h3', color: 'text.secondary' }}
            />

            <EditableText
              value={rubric.description}
              onChange={(newDescription: string) =>
                updateRubricUpdate({ ...rubric, description: newDescription })
              }
              isEditable={isEditable}
              multiline={true}
              typographyProps={{ variant: 'body1', color: 'text.secondary' }}
            />
          </Box>
        </Stack>

        <Stack direction="column" alignItems="center" spacing={1} flexShrink={0}>
          <Chip size="small" variant="outlined" label={`${rubric.scales?.length ?? 0} criteria`} />
          {isProjectLead && !consensusUi && (
            <>
              <Chip
                size="small"
                variant="filled"
                color={rubric.active ? 'success' : 'default'}
                label={rubric.active ? 'Active' : 'Inactive'}
              />
              <Chip
                size="small"
                variant="filled"
                color="primary"
                label={`Version ${rubric.versions[0]?.versionNum ?? 0}`}
              />
              {!isEditable && (
                <Chip
                  size="small"
                  variant="filled"
                  color="error"
                  label="Edit"
                  onClick={() => navigate(`/admin/project-lead/rubrics/${rubric.id}/EditRubric`)}
                />
              )}
            </>
          )}
          {isEditable && onAddSection && (
            <Button variant="contained" size="small" onClick={onAddSection} startIcon={<Add />}>
              Add Section
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Rubric expanded content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            p: 3,
          }}
        >
          {sections.map(({ section, scales }) => (
            <SectionBlock
              key={
                scales.length > 0
                  ? scales
                      .map((s) => s.id)
                      .sort()
                      .join('|')
                  : section
              }
              rubric={rubric}
              section={section}
              scales={scales}
              isEditable={isEditable}
              isResponding={isResponding ?? false}
              setResponses={setResponses ?? (() => {})}
              updateRubricUpdate={updateRubricUpdate}
              responses={responses ?? []}
              respondingContext={respondingContext}
              consensusUi={consensusUi}
              onAddScaleToSection={onAddScaleToSection}
              onMoveScaleToGraveyard={onMoveScaleToGraveyard}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
});

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ViewAllRubricsTemplateView({
  isEditable = false,
  updateRubricUpdate = () => {},
  isResponding = false,
  setResponses = () => {},
}: {
  isEditable?: boolean;
  updateRubricUpdate?: (updatedRubric: Rubric) => void;
  isResponding?: boolean;
  setResponses?: React.Dispatch<React.SetStateAction<Response[]>>;
}) {
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();

  const [expandedRubricId, setExpandedRubricId] = useState<string | null>(null);

  if (isLoadingRubrics)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasRubricsError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading rubrics
      </Box>
    );
  if (!rubrics || rubrics.length === 0)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        No rubrics found
      </Box>
    );

  const toggleRubric = (id: string) =>
    setExpandedRubricId((current) => (current === id ? null : id));

  return (
    <Box>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, py: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Rubrics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Project EMBER Introductory Mathematics Self-Assessment
            </Typography>
          </Box>
          <Chip label={`${rubrics.length} rubrics`} variant="outlined" />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {rubrics.map((rubric) => (
          <RubricRow
            key={rubric.id}
            rubric={rubric}
            isExpanded={expandedRubricId === rubric.id}
            onToggle={() => toggleRubric(rubric.id)}
            isEditable={isEditable}
            updateRubricUpdate={updateRubricUpdate}
            isResponding={isResponding}
            setResponses={setResponses}
          />
        ))}
      </Box>
    </Box>
  );
}
