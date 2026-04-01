import { ProjectLeadAuthGuard } from '../../../../Middleware/auth';
import {
  Box,
  Button,
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
import { Rubric } from '@shared/types';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
export default function EditRubric() {
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);

  const { rubricId } = useParams();
  if (!rubricId) return <div>Rubric ID not found</div>;
  const { rubric, isLoadingRubric, hasRubricError, refetchRubric } = useFetchRubric(rubricId);
  const [rubricUpdates, setRubricUpdates] = useState<Rubric | null>(null);
  const [changelog, setChangelog] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (rubric) setRubricUpdates(rubric);
  }, [rubric]);

  const handleRubricToggle = useCallback(() => {}, []);

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
      const response = await fetch(`${backendUrl}/rubrics/update/${rubricId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedRubric: rubricUpdates, changelog: changelog }),
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
        console.error('Failed to save changes');
        handleClose();
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: 'Failed to save changes',
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
        />

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
    </>
  );
}
