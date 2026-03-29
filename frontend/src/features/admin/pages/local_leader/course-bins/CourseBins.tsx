import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { LocalLeaderAuthGuard } from '../../../Middleware/auth';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchAllPredefiendCourseBins } from '@utils/hooks/courseBins/useFetchAllPredefiendCourseBins';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import { useEffect, useRef, useState, type RefObject } from 'react';
import type { CourseBin } from '@shared/types';

interface CourseBinDeletionImpact {
  assignedUserCount: number;
  responseCount: number;
}

function formatSingularPlural(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function EditableCourseBinName({
  courseBinId,
  displayName,
  snackbarsRef,
  onUpdated,
}: {
  courseBinId: string;
  displayName: string;
  snackbarsRef: RefObject<ConsecutiveSnackbarsHandle | null>;
  onUpdated: () => void;
}) {
  const [draftName, setDraftName] = useState(displayName);

  useEffect(() => {
    setDraftName(displayName);
  }, [displayName]);

  const executeSaveDisplayName = async () => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      setDraftName(displayName);
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Name cannot be empty',
      });
      return;
    }
    if (trimmed === displayName.trim()) {
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_BACKEND_URL is not configured.');
      return;
    }

    const response = await fetch(`${backendUrl}/course-bins/${courseBinId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: trimmed }),
    });

    if (!response.ok) {
      setDraftName(displayName);
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to update course bin name',
      });
      return;
    }

    snackbarsRef.current?.enqueue({
      status: MessageStatus.SUCCESS,
      message: 'Course bin name updated',
    });
    onUpdated();
  };

  return (
    <TextField
      value={draftName}
      onChange={(event) => setDraftName(event.target.value)}
      onBlur={() => {
        void executeSaveDisplayName();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          (event.target as HTMLInputElement).blur();
        }
      }}
      variant="standard"
      size="small"
      fullWidth
      aria-label="Course bin name"
    />
  );
}

export default function CourseBins() {
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const [open, setOpen] = useState(false);
  const [newCourseBinName, setNewCourseBinName] = useState('');
  const [newPredefinedCourseBinId, setNewPredefinedCourseBinId] = useState('');
  const [courseBinPendingDelete, setCourseBinPendingDelete] = useState<CourseBin | null>(null);
  const [deletionImpact, setDeletionImpact] = useState<CourseBinDeletionImpact | null>(null);
  const [isLoadingDeletionImpact, setIsLoadingDeletionImpact] = useState(false);
  const [hasDeletionImpactError, setHasDeletionImpactError] = useState(false);
  const [isDeletingCourseBin, setIsDeletingCourseBin] = useState(false);
  const { courseBins, isLoadingCourseBins, hasCourseBinsError, refetchCourseBins } =
    useFetchInstitutionCourseBins(isLoadingUser ? undefined : user?.institutionId);
  const { predefinedCourseBins, isLoadingPredefinedCourseBins, hasPredefinedCourseBinsError } =
    useFetchAllPredefiendCourseBins();

  useEffect(() => {
    if (!courseBinPendingDelete) {
      setDeletionImpact(null);
      setHasDeletionImpactError(false);
      setIsLoadingDeletionImpact(false);
      return;
    }

    let isCancelled = false;
    const executeFetchDeletionImpact = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not configured.');
        return;
      }
      setIsLoadingDeletionImpact(true);
      setHasDeletionImpactError(false);
      setDeletionImpact(null);

      const response = await fetch(
        `${backendUrl}/course-bins/${courseBinPendingDelete.id}/deletion-impact`,
        { credentials: 'include' }
      );

      if (isCancelled) {
        return;
      }

      setIsLoadingDeletionImpact(false);

      if (!response.ok) {
        setHasDeletionImpactError(true);
        return;
      }

      const data = (await response.json()) as CourseBinDeletionImpact;
      setDeletionImpact(data);
    };

    void executeFetchDeletionImpact();

    return () => {
      isCancelled = true;
    };
  }, [courseBinPendingDelete]);

  if (isLoadingCourseBins || isLoadingUser || isLoadingPredefinedCourseBins) {
    return <div>Loading...</div>;
  }
  if (hasCourseBinsError || hasUserError || hasPredefinedCourseBinsError) {
    return <div>Error loading resources</div>;
  }

  if (!courseBins || !user || !predefinedCourseBins) {
    return <div>No resources found</div>;
  }
  const createCourseBin = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_BACKEND_URL is not configured.');
      return;
    }
    const response = await fetch(`${backendUrl}/course-bins/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newCourseBinName,
        predefinedCourseBinId: newPredefinedCourseBinId,
        institutionId: user?.institutionId,
      }),
    });
    if (!response.ok) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to create course bin',
      });
      return;
    }
    const data = await response.json();
    snackbarsRef.current?.enqueue({
      status: MessageStatus.SUCCESS,
      message: data.message,
    });
    setOpen(false);
    setNewCourseBinName('');
    setNewPredefinedCourseBinId('');
    refetchCourseBins();
  };

  const executeCloseDeleteDialog = () => {
    setCourseBinPendingDelete(null);
  };

  const executeDeleteCourseBin = async () => {
    if (!courseBinPendingDelete) {
      return;
    }
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_BACKEND_URL is not configured.');
      return;
    }

    setIsDeletingCourseBin(true);
    const response = await fetch(`${backendUrl}/course-bins/${courseBinPendingDelete.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    setIsDeletingCourseBin(false);

    if (!response.ok) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to delete course bin',
      });
      return;
    }

    snackbarsRef.current?.enqueue({
      status: MessageStatus.SUCCESS,
      message: 'Course bin deleted',
    });
    executeCloseDeleteDialog();
    refetchCourseBins();
  };

  return (
    <LocalLeaderAuthGuard>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Course Bins
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Create Course Bin
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table aria-label="Course bins table" size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Predefined Course Bin</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courseBins.map((courseBin) => (
                <TableRow key={courseBin.id}>
                  <TableCell>
                    <EditableCourseBinName
                      courseBinId={courseBin.id}
                      displayName={courseBin.displayName}
                      snackbarsRef={snackbarsRef}
                      onUpdated={refetchCourseBins}
                    />
                  </TableCell>
                  <TableCell>
                    {
                      predefinedCourseBins.find(
                        (predefinedCourseBin) =>
                          predefinedCourseBin.id === courseBin.predefinedBinId
                      )?.binName
                    }
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label={`Delete course bin ${courseBin.displayName}`}
                      color="error"
                      size="small"
                      onClick={() => setCourseBinPendingDelete(courseBin)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={courseBinPendingDelete !== null}
        onClose={executeCloseDeleteDialog}
        aria-labelledby="delete-course-bin-dialog-title"
      >
        <DialogTitle id="delete-course-bin-dialog-title">Delete course bin</DialogTitle>
        <DialogContent>
          {courseBinPendingDelete && (
            <Typography sx={{ mb: 2 }}>
              Delete <strong>{courseBinPendingDelete.displayName}</strong>? This cannot be undone.
            </Typography>
          )}
          {isLoadingDeletionImpact && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={32} />
            </Box>
          )}
          {hasDeletionImpactError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              Could not load impact details. You can try again or cancel.
            </Alert>
          )}
          {!isLoadingDeletionImpact && deletionImpact && (
            <Alert severity="warning">
              <Typography component="span" display="block">
                {formatSingularPlural(
                  deletionImpact.assignedUserCount,
                  'user will be removed',
                  'users will be removed'
                )}{' '}
                from this course bin.
              </Typography>
              <Typography component="span" display="block" sx={{ mt: 1 }}>
                {formatSingularPlural(
                  deletionImpact.responseCount,
                  'rubric response will be permanently deleted',
                  'rubric responses will be permanently deleted'
                )}
                .
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={executeCloseDeleteDialog}
            disabled={isDeletingCourseBin}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => void executeDeleteCourseBin()}
            disabled={
              isDeletingCourseBin ||
              isLoadingDeletionImpact ||
              (deletionImpact === null && !hasDeletionImpactError)
            }
          >
            {isDeletingCourseBin ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Course Bin</DialogTitle>
        <DialogContent sx={{ mt: 2, mb: 2 }}>
          <TextField
            sx={{ mb: 2, mt: 1 }}
            label="Name"
            fullWidth
            value={newCourseBinName}
            onChange={(e) => setNewCourseBinName(e.target.value)}
          />
          <Autocomplete
            disableClearable
            forcePopupIcon={false}
            options={predefinedCourseBins}
            getOptionLabel={(option) => option.binName}
            onChange={(_event, value) => setNewPredefinedCourseBinId(value?.id ?? '')}
            renderInput={(params) => <TextField {...params} label="Predefined Course Bin" />}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => createCourseBin()}>
            Create
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </LocalLeaderAuthGuard>
  );
}
