import { ProjectLeadAuthGuard } from '../../../../Middleware/auth';
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useFetchRubric } from '@utils/hooks/rubrics/useFetchRubric';
import { useParams } from 'react-router-dom';
import { RubricRow } from '../../../../../rubrics/components/ViewAllRubricsTemplateView';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Rubric, RubricScale } from '@shared/types';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';

const DEFAULT_LEVEL_DESCRIPTIONS = {
  0: { label: 'Baseline', description: '' },
  1: { label: 'Beginning', description: '' },
  2: { label: 'Developing', description: '' },
  3: { label: 'Accomplished', description: '' },
  4: { label: 'Exemplar', description: '' },
};

const DEFAULT_SECTION_NAME = 'New Section';
const DEFAULT_SCALE_PROMPT = 'New criterion';

function buildClientScaleId(): string {
  return `new-scale-${crypto.randomUUID()}`;
}

function getNormalizedScales(scales: RubricScale[]): RubricScale[] {
  return scales.map((scale, orderIndex) => ({ ...scale, orderIndex }));
}

function buildUniqueSectionName(scales: RubricScale[]): string {
  const usedSectionNames = new Set(scales.map((scale) => scale.section ?? 'General'));
  if (!usedSectionNames.has(DEFAULT_SECTION_NAME)) {
    return DEFAULT_SECTION_NAME;
  }
  let index = 2;
  while (usedSectionNames.has(`${DEFAULT_SECTION_NAME} ${index}`)) {
    index += 1;
  }
  return `${DEFAULT_SECTION_NAME} ${index}`;
}

function isSectionNameTaken(scales: RubricScale[], sectionName: string): boolean {
  const normalizedSectionName = sectionName.trim().toLowerCase();
  return scales.some(
    (scale) => (scale.section ?? 'General').trim().toLowerCase() === normalizedSectionName
  );
}

function buildNewScale({
  section,
  orderIndex,
}: {
  section: string;
  orderIndex: number;
}): RubricScale {
  return {
    id: buildClientScaleId(),
    section,
    prompt: DEFAULT_SCALE_PROMPT,
    orderIndex,
    editable: true,
    isGlobal: true,
    binIds: [],
    levelDescriptions: DEFAULT_LEVEL_DESCRIPTIONS,
  };
}
export default function EditRubric() {
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);

  const { rubricId } = useParams();
  const resolvedRubricId = rubricId ?? '';
  const { rubric, isLoadingRubric, hasRubricError, refetchRubric } =
    useFetchRubric(resolvedRubricId);
  const [rubricUpdates, setRubricUpdates] = useState<Rubric | null>(null);
  const [graveyardScales, setGraveyardScales] = useState<RubricScale[]>([]);
  const [changelog, setChangelog] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState<string>('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenSectionDialog = useCallback(() => {
    setRubricUpdates((previousRubric) => {
      const suggestedSectionName = buildUniqueSectionName(previousRubric?.scales ?? []);
      setNewSectionName(suggestedSectionName);
      return previousRubric;
    });
    setIsSectionDialogOpen(true);
  }, []);
  const handleCloseSectionDialog = useCallback(() => setIsSectionDialogOpen(false), []);
  useEffect(() => {
    if (rubric) {
      setRubricUpdates({ ...rubric, graveyardScales: undefined });
      setGraveyardScales(rubric.graveyardScales ?? []);
    }
  }, [rubric]);

  const handleRubricToggle = useCallback(() => {}, []);

  const handleAddSection = useCallback(() => {
    const normalizedSectionName = newSectionName.trim();
    if (!normalizedSectionName) {
      return;
    }
    setRubricUpdates((previousRubric) => {
      if (!previousRubric) return previousRubric;
      if (isSectionNameTaken(previousRubric.scales ?? [], normalizedSectionName)) {
        return previousRubric;
      }
      const nextScales = getNormalizedScales([
        ...(previousRubric.scales ?? []),
        buildNewScale({
          section: normalizedSectionName,
          orderIndex: (previousRubric.scales ?? []).length,
        }),
      ]);
      return { ...previousRubric, scales: nextScales };
    });
    setIsSectionDialogOpen(false);
  }, [newSectionName]);

  const handleAddScaleToSection = useCallback((sectionName: string) => {
    setRubricUpdates((previousRubric) => {
      if (!previousRubric) return previousRubric;
      const nextScales = getNormalizedScales([
        ...(previousRubric.scales ?? []),
        buildNewScale({ section: sectionName, orderIndex: (previousRubric.scales ?? []).length }),
      ]);
      return { ...previousRubric, scales: nextScales };
    });
  }, []);

  const handleMoveScaleToGraveyard = useCallback(
    (scaleId: string) => {
      const scaleToMove = rubricUpdates?.scales.find((scale) => scale.id === scaleId);
      if (!scaleToMove) return;

      setRubricUpdates((previousRubric) => {
        if (!previousRubric) return previousRubric;
        const remainingScales = previousRubric.scales.filter((scale) => scale.id !== scaleId);
        return { ...previousRubric, scales: getNormalizedScales(remainingScales) };
      });

      setGraveyardScales((previousGraveyardScales) => {
        if (previousGraveyardScales.some((scale) => scale.id === scaleId)) {
          return previousGraveyardScales;
        }
        return [...previousGraveyardScales, scaleToMove];
      });
    },
    [rubricUpdates]
  );

  const handleRestoreScaleFromGraveyard = useCallback(
    (scaleId: string) => {
      const scaleToRestore = graveyardScales.find((scale) => scale.id === scaleId);
      if (!scaleToRestore) return;

      setRubricUpdates((previousRubric) => {
        if (!previousRubric) return previousRubric;
        if (previousRubric.scales.some((scale) => scale.id === scaleId)) {
          return previousRubric;
        }
        const nextScales = getNormalizedScales([...(previousRubric.scales ?? []), scaleToRestore]);
        return { ...previousRubric, scales: nextScales };
      });

      setGraveyardScales((previousGraveyardScales) =>
        previousGraveyardScales.filter((scale) => scale.id !== scaleId)
      );
    },
    [graveyardScales]
  );

  if (!rubricId) return <div>Rubric ID not found</div>;

  const editableScales = rubricUpdates?.scales ?? [];
  const hasInvalidSectionName = newSectionName.trim().length === 0;
  const hasDuplicateSectionName =
    !hasInvalidSectionName && isSectionNameTaken(editableScales, newSectionName);

  if (isLoadingRubric)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasRubricError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading rubric
      </Box>
    );
  if (!rubricUpdates)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Rubric not found
      </Box>
    );

  const handleSaveChanges = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        return;
      }
      const sanitizedRubricUpdate = {
        ...rubricUpdates,
        scales: getNormalizedScales(rubricUpdates.scales).map((scale) => ({
          ...(scale.originalScaleId ? { originalScaleId: scale.originalScaleId } : {}),
          prompt: scale.prompt,
          orderIndex: scale.orderIndex,
          isGlobal: scale.isGlobal,
          editable: scale.editable,
          section: scale.section,
          levelDescriptions: scale.levelDescriptions,
          binIds: Array.from(new Set(scale.binIds ?? [])),
        })),
        graveyardScales: graveyardScales.map((scale) => ({
          ...(scale.originalScaleId ? { originalScaleId: scale.originalScaleId } : {}),
          prompt: scale.prompt,
          orderIndex: scale.orderIndex,
          isGlobal: scale.isGlobal,
          editable: scale.editable,
          section: scale.section,
          levelDescriptions: scale.levelDescriptions,
          binIds: Array.from(new Set(scale.binIds ?? [])),
        })),
      };
      const response = await fetch(`${backendUrl}/rubrics/update/${rubricId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedRubric: sanitizedRubricUpdate, changelog: changelog }),
        credentials: 'include',
      });
      if (response.ok) {
        refetchRubric();
        handleClose();
        snackbarsRef.current?.enqueue({
          status: MessageStatus.SUCCESS,
          message: 'Changes saved',
        });
      } else {
        const errorResponse = await response.json().catch(() => null);
        const errorMessage = errorResponse?.error ?? 'Failed to save changes';
        handleClose();
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error('Failed to save changes', error);
    }
  };

  return (
    <>
      <ProjectLeadAuthGuard>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Edit Rubric</Typography>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Save Changes
            </Button>
          </Stack>
        </Box>
        <RubricRow
          rubric={rubricUpdates}
          isExpanded={true}
          onToggle={handleRubricToggle}
          isEditable={true}
          updateRubricUpdate={setRubricUpdates}
          onAddSection={handleOpenSectionDialog}
          onAddScaleToSection={handleAddScaleToSection}
          onMoveScaleToGraveyard={handleMoveScaleToGraveyard}
        />
        {graveyardScales.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Graveyard Scales
            </Typography>
            <Stack spacing={1}>
              {graveyardScales.map((scale) => (
                <Box
                  key={scale.id}
                  sx={{
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      {scale.section ?? 'General'}
                    </Typography>
                    <Typography variant="body1">{scale.prompt}</Typography>
                  </Stack>
                  <Chip
                    color="success"
                    label="Restore"
                    onClick={() => handleRestoreScaleFromGraveyard(scale.id)}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <ConsecutiveSnackbars ref={snackbarsRef} />
      </ProjectLeadAuthGuard>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Save Changes</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please provide a changelog for the changes you made.
            </Typography>
            <TextField
              fullWidth
              sx={{ height: '200%' }}
              label="Changelog"
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isSectionDialogOpen} onClose={handleCloseSectionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Section</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Section Name"
              value={newSectionName}
              onChange={(event) => setNewSectionName(event.target.value)}
              error={hasInvalidSectionName || hasDuplicateSectionName}
              helperText={
                hasInvalidSectionName
                  ? 'Section name is required.'
                  : hasDuplicateSectionName
                    ? 'A section with this name already exists.'
                    : 'A new scale will be created in this section.'
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSectionDialog}>Cancel</Button>
          <Button
            onClick={handleAddSection}
            disabled={hasInvalidSectionName || hasDuplicateSectionName}
          >
            Add Section
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
