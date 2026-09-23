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
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import {
  useFetchTpseAdminUsers,
  type TpseAdminUserRow,
} from '@utils/hooks/tpseAdmin/useFetchTpseAdminUsers';
import {
  executeDeleteTpseAdminUser,
  fetchUserDeletionImpact,
  type UserDeletionImpact,
} from '@utils/hooks/tpseAdmin/tpseAdminDeleteApi';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';

export default function TpseAdminDeleteUsersPage() {
  const navigate = useNavigate();
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);
  const { user: sessionUser } = useFetchUser();
  const { users, isLoadingUsers, hasUsersError, refetchUsers } = useFetchTpseAdminUsers(true);

  const [userPendingDelete, setUserPendingDelete] = useState<TpseAdminUserRow | null>(null);
  const [deletionImpact, setDeletionImpact] = useState<UserDeletionImpact | null>(null);
  const [isLoadingDeletionImpact, setIsLoadingDeletionImpact] = useState(false);
  const [hasDeletionImpactError, setHasDeletionImpactError] = useState(false);
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  useEffect(() => {
    if (!userPendingDelete) {
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
        const impact = await fetchUserDeletionImpact(userPendingDelete.id);
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
  }, [userPendingDelete]);

  const canConfirmDelete = (() => {
    if (!deletionImpact || isLoadingDeletionImpact || isDeletingUser) return false;
    if (!deletionImpact.requiresTypedConfirmation) return true;
    return confirmationPhrase.trim() === deletionImpact.confirmationPhrase;
  })();

  const handleDeleteUser = async () => {
    if (!userPendingDelete || !deletionImpact) return;
    setIsDeletingUser(true);
    try {
      await executeDeleteTpseAdminUser({
        userId: userPendingDelete.id,
        confirmationPhrase: confirmationPhrase.trim() || undefined,
      });
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: `Deleted user: ${userPendingDelete.email}`,
      });
      setUserPendingDelete(null);
      refetchUsers();
    } catch (error) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: error instanceof Error ? error.message : 'Failed to delete user',
      });
    } finally {
      setIsDeletingUser(false);
    }
  };

  if (isLoadingUsers) {
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

  if (hasUsersError) {
    return (
      <TpseAdminAuthGuard>
        <Typography color="error">Error loading users.</Typography>
      </TpseAdminAuthGuard>
    );
  }

  return (
    <TpseAdminAuthGuard>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Delete users
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
          Deleting a user permanently removes their rubric responses, consensus responses,
          assignments, and course-bin links. Invitations they sent stay, but the inviter link is
          cleared.
        </Alert>

        <TableContainer component={Paper} variant="outlined">
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Institution</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 110 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => {
                const isSelf = row.id === sessionUser?.id;
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.institution?.name ?? '—'}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        disabled={isSelf}
                        onClick={() => setUserPendingDelete(row)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={userPendingDelete !== null}
          onClose={() => !isDeletingUser && setUserPendingDelete(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Delete user</DialogTitle>
          <DialogContent>
            {userPendingDelete && (
              <Typography sx={{ mb: 2 }}>
                Delete <strong>{userPendingDelete.name}</strong> ({userPendingDelete.email})? This
                cannot be undone.
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
                {deletionImpact.warnings.length === 0 && (
                  <Typography component="span" display="block">
                    No linked responses or assignments found for this user.
                  </Typography>
                )}
              </Alert>
            )}
            {deletionImpact?.requiresTypedConfirmation && (
              <TextField
                fullWidth
                label={`Type ${deletionImpact.confirmationPhrase} to confirm`}
                value={confirmationPhrase}
                onChange={(event) => setConfirmationPhrase(event.target.value)}
                autoComplete="off"
                disabled={isDeletingUser}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setUserPendingDelete(null)}
              disabled={isDeletingUser}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => void handleDeleteUser()}
              disabled={!canConfirmDelete}
            >
              {isDeletingUser ? 'Deleting…' : 'Delete user'}
            </Button>
          </DialogActions>
        </Dialog>

        <ConsecutiveSnackbars ref={snackbarsRef} />
      </Box>
    </TpseAdminAuthGuard>
  );
}
