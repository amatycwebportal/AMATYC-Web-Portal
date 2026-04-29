import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectLeadAuthGuard } from '../../Middleware/auth';
import {
  formatInstitutionLabel,
  InstitutionSummary,
  useFetchInstitutions,
} from '@utils/hooks/institutions/useFetchInstitutions';
import { useFetchAllUsers } from '@utils/hooks/users/useFetchAllUsers';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';

export default function ManageInstitutions() {
  const navigate = useNavigate();
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);
  const [institutionPendingDelete, setInstitutionPendingDelete] = useState<InstitutionSummary | null>(
    null
  );
  const [isDeletingInstitution, setIsDeletingInstitution] = useState(false);

  const {
    institutions,
    isLoadingInstitutions,
    hasInstitutionsError,
    refetchInstitutions,
  } = useFetchInstitutions(true);
  const { users, isLoadingUsers, hasUsersError, refetchUsers } = useFetchAllUsers();

  const localLeadersByInstitutionId = useMemo(() => {
    const localLeaderMap = new Map<string, { id: string; name: string; email: string }[]>();
    for (const user of users) {
      if (user.role !== 'LOCAL_LEADER' || !user.institutionId) continue;
      const existingEntries = localLeaderMap.get(user.institutionId) ?? [];
      existingEntries.push({ id: user.id, name: user.name, email: user.email });
      localLeaderMap.set(user.institutionId, existingEntries);
    }
    return localLeaderMap;
  }, [users]);

  const handleDeleteInstitution = async () => {
    if (!institutionPendingDelete) return;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Backend URL is not configured.',
      });
      return;
    }

    setIsDeletingInstitution(true);
    try {
      const response = await fetch(`${backendUrl}/institutions/${institutionPendingDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? 'Failed to delete institution');
      }
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: `Deleted institution: ${institutionPendingDelete.name}`,
      });
      setInstitutionPendingDelete(null);
      refetchInstitutions();
      refetchUsers();
    } catch (error) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: error instanceof Error ? error.message : 'Failed to delete institution',
      });
    } finally {
      setIsDeletingInstitution(false);
    }
  };

  if (isLoadingInstitutions || isLoadingUsers) {
    return (
      <ProjectLeadAuthGuard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </ProjectLeadAuthGuard>
    );
  }

  if (hasInstitutionsError || hasUsersError) {
    return (
      <ProjectLeadAuthGuard>
        <Typography color="error">Error loading institutions.</Typography>
      </ProjectLeadAuthGuard>
    );
  }

  return (
    <ProjectLeadAuthGuard>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Manage Institutions
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DomainAddOutlinedIcon />}
            onClick={() => navigate('/admin/institutions')}
          >
            Create institution
          </Button>
        </Box>

        <Alert severity="warning" sx={{ mb: 2 }}>
          Deleting an institution will remove users from that institution and wipe their responses.
        </Alert>

        <TableContainer component={Paper} variant="outlined">
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Institution</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Academic year</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Local leaders</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 110 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {institutions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No institutions found.
                  </TableCell>
                </TableRow>
              ) : (
                institutions.map((institution) => {
                  const localLeaders = localLeadersByInstitutionId.get(institution.id) ?? [];
                  return (
                    <TableRow key={institution.id} hover>
                      <TableCell>{institution.name}</TableCell>
                      <TableCell>{institution.academicSchoolYear}</TableCell>
                      <TableCell sx={{ minWidth: 320 }}>
                        <FormControl fullWidth size="small" disabled={localLeaders.length === 0}>
                          <InputLabel id={`institution-leaders-${institution.id}`}>
                            {localLeaders.length > 0 ? 'Local leaders' : 'No local leaders'}
                          </InputLabel>
                          <Select
                            labelId={`institution-leaders-${institution.id}`}
                            value=""
                            label={localLeaders.length > 0 ? 'Local leaders' : 'No local leaders'}
                            displayEmpty
                          >
                            {localLeaders.length === 0 ? (
                              <MenuItem value="" disabled>
                                No local leaders assigned
                              </MenuItem>
                            ) : (
                              localLeaders.map((leader) => (
                                <MenuItem key={leader.id} value={leader.id}>
                                  {leader.name} ({leader.email})
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="error"
                          size="small"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => setInstitutionPendingDelete(institution)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={Boolean(institutionPendingDelete)}
        onClose={() => (isDeletingInstitution ? undefined : setInstitutionPendingDelete(null))}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete institution?</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            You are about to delete{' '}
            {institutionPendingDelete ? formatInstitutionLabel(institutionPendingDelete) : 'this institution'}.
          </Typography>
          <Alert severity="error">
            This action cannot be undone. All users will be removed from this institution and their
            responses will be permanently wiped.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setInstitutionPendingDelete(null)}
            disabled={isDeletingInstitution}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleDeleteInstitution()}
            disabled={isDeletingInstitution}
          >
            {isDeletingInstitution ? 'Deleting...' : 'Delete institution'}
          </Button>
        </DialogActions>
      </Dialog>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </ProjectLeadAuthGuard>
  );
}
