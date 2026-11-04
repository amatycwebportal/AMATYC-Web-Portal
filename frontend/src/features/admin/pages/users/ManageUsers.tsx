import {
  Box,
  Button,
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
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AdminAuthGuard } from '../../Middleware/auth';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchAllUsers } from '@utils/hooks/users/useFetchAllUsers';
import {
  formatInstitutionLabel,
  useFetchInstitutions,
} from '@utils/hooks/institutions/useFetchInstitutions';
import { executeUpdateUser } from '@utils/hooks/users/executeUpdateUser';
import { formatUserRole, type User, type UserRole } from '@shared/types';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';

const USER_ROLE_OPTIONS: UserRole[] = ['PROJECT_LEAD', 'LOCAL_LEADER', 'USER'];
const COLLEGE_LEAD_ROLE_OPTIONS: UserRole[] = ['LOCAL_LEADER', 'USER'];

function getDisabledRoleHelperText(params: {
  isEditingSelf: boolean;
  isTargetProjectLead: boolean;
}): string {
  if (params.isEditingSelf) return 'You cannot change your own role.';
  if (params.isTargetProjectLead) return 'Administrator roles cannot be changed.';
  return 'You cannot change this role.';
}

export default function ManageUsers() {
  const navigate = useNavigate();
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);
  const [dialogUser, setDialogUser] = useState<User | null>(null);
  const [formName, setFormName] = useState('');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('USER');
  const [formInstitutionId, setFormInstitutionId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const { user: sessionUser, isLoadingUser, hasUserError } = useFetchUser();
  const isProjectLead = sessionUser?.role === 'PROJECT_LEAD';
  const isLocalLeader = sessionUser?.role === 'LOCAL_LEADER';
  const isEditingSelf = dialogUser?.id === sessionUser?.id;
  const isTargetProjectLead = dialogUser?.role === 'PROJECT_LEAD';
  const canChangeRole = (isProjectLead || isLocalLeader) && !isEditingSelf && !isTargetProjectLead;
  const roleOptions = isProjectLead ? USER_ROLE_OPTIONS : COLLEGE_LEAD_ROLE_OPTIONS;
  const shouldFetchInstitutions = Boolean(
    sessionUser && ['PROJECT_LEAD', 'LOCAL_LEADER'].includes(sessionUser.role)
  );

  const { institutions, isLoadingInstitutions, hasInstitutionsError } =
    useFetchInstitutions(shouldFetchInstitutions);
  const { users, isLoadingUsers, hasUsersError, refetchUsers } = useFetchAllUsers();

  const institutionNameById = useMemo(() => {
    const map = new Map<string, string>();
    institutions.forEach((institution) =>
      map.set(institution.id, formatInstitutionLabel(institution))
    );
    return map;
  }, [institutions]);

  const openEditDialog = (targetUser: User) => {
    setDialogUser(targetUser);
    setFormName(targetUser.name);
    setFormAvatarUrl(targetUser.avatarUrl ?? '');
    setFormRole(targetUser.role);
    setFormInstitutionId(targetUser.institutionId ?? '');
  };

  const closeEditDialog = () => {
    setDialogUser(null);
  };

  const handleSaveUser = async () => {
    if (!dialogUser) return;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Backend URL is not configured.',
      });
      return;
    }

    setIsSaving(true);
    try {
      await executeUpdateUser(backendUrl, dialogUser.id, {
        name: formName.trim(),
        ...(canChangeRole ? { role: formRole } : {}),
        ...(isProjectLead
          ? {
              institutionId: formInstitutionId === '' ? null : formInstitutionId,
            }
          : {}),
        avatarUrl: formAvatarUrl.trim() === '' ? null : formAvatarUrl.trim(),
      });
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: 'User updated.',
      });
      closeEditDialog();
      refetchUsers();
    } catch (err) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: err instanceof Error ? err.message : 'Failed to update user.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingUser || isLoadingUsers)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasUserError || hasUsersError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading users
      </Box>
    );
  if (shouldFetchInstitutions && isLoadingInstitutions)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (shouldFetchInstitutions && hasInstitutionsError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading institutions
      </Box>
    );

  return (
    <AdminAuthGuard>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Manage Users
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/admin/users')}
          >
            Invite users
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table stickyHeader size="small">
            <TableHead
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <TableRow sx={{ bgcolor: 'background.paper', borderBottom: '1px solid' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Institution</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', width: 100 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{formatUserRole(row.role)}</TableCell>
                    <TableCell>
                      {row.institutionId
                        ? (institutionNameById.get(row.institutionId) ?? row.institutionId)
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => openEditDialog(row)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={Boolean(dialogUser)} onClose={closeEditDialog} fullWidth maxWidth="sm">
          <DialogTitle>Edit user</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              sx={{ mt: 2 }}
              label="Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              value={dialogUser?.email ?? ''}
              fullWidth
              disabled
              helperText="Email is tied to the sign-in account and cannot be changed here."
            />
            <TextField
              label="Avatar URL"
              value={formAvatarUrl}
              onChange={(e) => setFormAvatarUrl(e.target.value)}
              fullWidth
            />
            {canChangeRole ? (
              <FormControl fullWidth>
                <InputLabel id="manage-user-role-label">Role</InputLabel>
                <Select
                  labelId="manage-user-role-label"
                  label="Role"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                >
                  {roleOptions.map((roleOption) => (
                    <MenuItem key={roleOption} value={roleOption}>
                      {formatUserRole(roleOption)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label="Role"
                value={formatUserRole(formRole)}
                fullWidth
                disabled
                helperText={getDisabledRoleHelperText({ isEditingSelf, isTargetProjectLead })}
              />
            )}
            {isProjectLead ? (
              <FormControl fullWidth>
                <InputLabel id="manage-user-inst-label">Institution</InputLabel>
                <Select
                  labelId="manage-user-inst-label"
                  label="Institution"
                  value={formInstitutionId}
                  onChange={(e) => {
                    setFormInstitutionId(e.target.value as string);
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {institutions.map((institution) => (
                    <MenuItem key={institution.id} value={institution.id}>
                      {formatInstitutionLabel(institution)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label="Institution"
                value={
                  dialogUser?.institutionId
                    ? (institutionNameById.get(dialogUser.institutionId) ??
                      dialogUser.institutionId)
                    : '—'
                }
                fullWidth
                disabled
                helperText="Institution is fixed for College leads."
              />
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeEditDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => void handleSaveUser()}
              disabled={isSaving || formName.trim() === ''}
            >
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </AdminAuthGuard>
  );
}
