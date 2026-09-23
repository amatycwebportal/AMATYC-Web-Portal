import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TpseAdminAuthGuard } from '../../Middleware/auth';
import {
  useFetchTpseAdminInstitutions,
  type TpseAdminInstitutionRow,
} from '@utils/hooks/tpseAdmin/useFetchTpseAdminInstitutions';
import {
  executeDeleteTpseAdminInstitution,
  fetchInstitutionDeletionImpact,
  type InstitutionDeletionImpact,
} from '@utils/hooks/tpseAdmin/tpseAdminDeleteApi';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';

export default function TpseAdminDeleteInstitutionsPage() {
  const navigate = useNavigate();
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);
  const { institutions, isLoadingInstitutions, hasInstitutionsError, refetchInstitutions } =
    useFetchTpseAdminInstitutions(true);

  const [institutionPendingDelete, setInstitutionPendingDelete] =
    useState<TpseAdminInstitutionRow | null>(null);
  const [deletionImpact, setDeletionImpact] = useState<InstitutionDeletionImpact | null>(null);
  const [isLoadingDeletionImpact, setIsLoadingDeletionImpact] = useState(false);
  const [hasDeletionImpactError, setHasDeletionImpactError] = useState(false);
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [isDeletingInstitution, setIsDeletingInstitution] = useState(false);

  useEffect(() => {
    if (!institutionPendingDelete) {
      setDeletionImpact(null);
      setHasDeletionImpactError(false);
      setIsLoadingDeletionImpact(false);
      setConfirmationPhrase('');
      return;
    }

    let isCancelled = false;
    const executeFetchImpact = async () => {
      setIsLoadingDeletionImpact(true);
      setHasDeletionImpactError(false);
      setDeletionImpact(null);
      setConfirmationPhrase('');
      try {
        const impact = await fetchInstitutionDeletionImpact(institutionPendingDelete.id);
        if (!isCancelled) setDeletionImpact(impact);
      } catch {
        if (!isCancelled) setHasDeletionImpactError(true);
      } finally {
        if (!isCancelled) setIsLoadingDeletionImpact(false);
      }
    };

    void executeFetchImpact();
    return () => {
      isCancelled = true;
    };
  }, [institutionPendingDelete]);

  const canConfirmDelete = (() => {
    if (!deletionImpact || isLoadingDeletionImpact || isDeletingInstitution) return false;
    if (!deletionImpact.requiresTypedConfirmation) return true;
    return confirmationPhrase.trim() === deletionImpact.confirmationPhrase;
  })();

  const handleDeleteInstitution = async () => {
    if (!institutionPendingDelete || !deletionImpact) return;
    setIsDeletingInstitution(true);
    try {
      await executeDeleteTpseAdminInstitution({
        institutionId: institutionPendingDelete.id,
        confirmationPhrase: confirmationPhrase.trim() || undefined,
      });
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: `Deleted institution: ${institutionPendingDelete.name}`,
      });
      setInstitutionPendingDelete(null);
      refetchInstitutions();
    } catch (error) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: error instanceof Error ? error.message : 'Failed to delete institution',
      });
    } finally {
      setIsDeletingInstitution(false);
    }
  };

  if (isLoadingInstitutions) {
    return (
      <TpseAdminAuthGuard>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '40vh',
          }}
        >
          <CircularProgress />
        </Box>
      </TpseAdminAuthGuard>
    );
  }

  if (hasInstitutionsError) {
    return (
      <TpseAdminAuthGuard>
        <Typography color="error">Error loading institutions.</Typography>
      </TpseAdminAuthGuard>
    );
  }

  return (
    <TpseAdminAuthGuard>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Delete institutions
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/tpse-admin')}
          >
            TPSE Admin
          </Button>
        </Box>

        <Alert severity="warning" sx={{ mb: 2 }}>
          Deleting an institution removes its course bins, courses, invitations, and related rubric
          / consensus responses. Member accounts are detached from the institution, not deleted.
        </Alert>

        <TableContainer component={Paper} variant="outlined">
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Institution</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Academic year</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Users</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Course bins</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 110 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {institutions.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.academicSchoolYear}</TableCell>
                  <TableCell>{row._count.users}</TableCell>
                  <TableCell>{row._count.courseBins}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => setInstitutionPendingDelete(row)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={institutionPendingDelete !== null}
          onClose={() => !isDeletingInstitution && setInstitutionPendingDelete(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Delete institution</DialogTitle>
          <DialogContent>
            {institutionPendingDelete && (
              <Typography sx={{ mb: 2 }}>
                Delete <strong>{institutionPendingDelete.name}</strong>? This cannot be undone.
              </Typography>
            )}
            {isLoadingDeletionImpact && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={32} />
              </Box>
            )}
            {hasDeletionImpactError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                Could not load impact details. Cancel and try again.
              </Alert>
            )}
            {!isLoadingDeletionImpact && deletionImpact && (
              <Alert
                severity="warning"
                sx={{ mb: deletionImpact.requiresTypedConfirmation ? 2 : 0 }}
              >
                {deletionImpact.warnings.map((warning) => (
                  <Typography key={warning} component="span" display="block" sx={{ mb: 0.5 }}>
                    {warning}
                  </Typography>
                ))}
              </Alert>
            )}
            {deletionImpact?.requiresTypedConfirmation && (
              <TextField
                fullWidth
                label={`Type ${deletionImpact.confirmationPhrase} to confirm`}
                value={confirmationPhrase}
                onChange={(event) => setConfirmationPhrase(event.target.value)}
                autoComplete="off"
                disabled={isDeletingInstitution}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setInstitutionPendingDelete(null)}
              disabled={isDeletingInstitution}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => void handleDeleteInstitution()}
              disabled={!canConfirmDelete}
            >
              {isDeletingInstitution ? 'Deleting…' : 'Delete institution'}
            </Button>
          </DialogActions>
        </Dialog>

        <ConsecutiveSnackbars ref={snackbarsRef} />
      </Box>
    </TpseAdminAuthGuard>
  );
}
