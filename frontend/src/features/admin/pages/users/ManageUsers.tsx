import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
  type SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { AdminAuthGuard } from '../../Middleware/auth';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchAllUsers } from '@utils/hooks/users/useFetchAllUsers';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import { useFetchInstitutions } from '@utils/hooks/institutions/useFetchInstitutions';
import { executeUpdateUser } from '@utils/hooks/users/executeUpdateUser';
import type { User, UserRole } from '@shared/types';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';

const USER_ROLE_OPTIONS: UserRole[] = ['PROJECT_LEAD', 'LOCAL_LEADER', 'FACULTY', 'USER'];

export default function ManageUsers() {
  const navigate = useNavigate();
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);
  const [dialogUser, setDialogUser] = useState<User | null>(null);
  const [formName, setFormName] = useState('');
  const [formAvatarUrl, setFormAvatarUrl] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('USER');
  const [formInstitutionId, setFormInstitutionId] = useState<string>('');
  const [formCourseBinIds, setFormCourseBinIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { user: sessionUser, isLoadingUser, hasUserError } = useFetchUser();
  const isProjectLead = sessionUser?.role === 'PROJECT_LEAD';
  const shouldFetchInstitutions = Boolean(
    sessionUser && ['PROJECT_LEAD', 'LOCAL_LEADER'].includes(sessionUser.role)
  );

  const { institutions, isLoadingInstitutions, hasInstitutionsError } =
    useFetchInstitutions(shouldFetchInstitutions);
  const { users, isLoadingUsers, hasUsersError, refetchUsers } = useFetchAllUsers();

  const institutionNameById = useMemo(() => {
    const map = new Map<string, string>();
    institutions.forEach((institution) => map.set(institution.id, institution.name));
    return map;
  }, [institutions]);

  const { courseBins, isLoadingCourseBins, hasCourseBinsError } = useFetchInstitutionCourseBins(
    formInstitutionId || undefined
  );

  const openEditDialog = (targetUser: User) => {
    setDialogUser(targetUser);
    setFormName(targetUser.name);
    setFormAvatarUrl(targetUser.avatarUrl ?? '');
    setFormRole(targetUser.role);
    setFormInstitutionId(targetUser.institutionId ?? '');
    setFormCourseBinIds(targetUser.userCourseBins.map((row) => row.courseBinId));
  };

  const closeEditDialog = () => {
    setDialogUser(null);
  };

  const handleCourseBinSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormCourseBinIds(typeof value === 'string' ? value.split(',') : value);
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
        role: formRole,
        ...(isProjectLead
          ? {
              institutionId: formInstitutionId === '' ? null : formInstitutionId,
            }
          : {}),
        avatarUrl: formAvatarUrl.trim() === '' ? null : formAvatarUrl.trim(),
        courseBinIds: formCourseBinIds,
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
  console.log(users);
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
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Institution</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Course bins</TableCell>
                <TableCell sx={{ fontWeight: 700 }} width={100}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      {row.institutionId
                        ? (institutionNameById.get(row.institutionId) ?? row.institutionId)
                        : '—'}
                    </TableCell>
                    <TableCell>{row.userCourseBins.length}</TableCell>
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
            <FormControl fullWidth>
              <InputLabel id="manage-user-role-label">Role</InputLabel>
              <Select
                labelId="manage-user-role-label"
                label="Role"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
              >
                {USER_ROLE_OPTIONS.map((roleOption) => (
                  <MenuItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isProjectLead ? (
              <FormControl fullWidth>
                <InputLabel id="manage-user-inst-label">Institution</InputLabel>
                <Select
                  labelId="manage-user-inst-label"
                  label="Institution"
                  value={formInstitutionId}
                  onChange={(e) => {
                    const nextId = e.target.value as string;
                    setFormInstitutionId(nextId);
                    setFormCourseBinIds([]);
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {institutions.map((institution) => (
                    <MenuItem key={institution.id} value={institution.id}>
                      {institution.name}
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
                helperText="Institution is fixed for local leaders."
              />
            )}
            {formInstitutionId ? (
              <FormControl fullWidth disabled={hasCourseBinsError}>
                <InputLabel id="manage-user-bins-label">Course bins</InputLabel>
                <Select
                  labelId="manage-user-bins-label"
                  multiple
                  value={formCourseBinIds}
                  onChange={handleCourseBinSelectChange}
                  input={<OutlinedInput label="Course bins" />}
                  renderValue={(selected) =>
                    (selected as string[])
                      .map((id) => courseBins.find((b) => b.id === id)?.displayName ?? id)
                      .join(', ')
                  }
                >
                  {isLoadingCourseBins ? (
                    <MenuItem disabled>Loading bins…</MenuItem>
                  ) : (
                    courseBins.map((bin) => (
                      <MenuItem key={bin.id} value={bin.id}>
                        <Checkbox checked={formCourseBinIds.includes(bin.id)} />
                        {bin.displayName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Select an institution to assign course bins.
              </Typography>
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
