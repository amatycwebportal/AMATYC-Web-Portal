import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import GroupIcon from '@mui/icons-material/Group';
import { AdminAuthGuard } from '../../Middleware/auth';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import {
  formatInstitutionLabel,
  useFetchInstitutions,
} from '@utils/hooks/institutions/useFetchInstitutions';
import type { CourseBin, UserRole } from '@shared/types';
import { describeInviteApiError } from './inviteUserErrors';

interface InviteEntry {
  email: string;
  role: UserRole;
  institutionId: string;
  courseBinIds: string[];
  assignAllRubricsOnAccept: boolean;
}

const USER_ROLE_OPTIONS: UserRole[] = ['PROJECT_LEAD', 'LOCAL_LEADER', 'FACULTY', 'USER'];

export default function InviteUsers() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [singleEmail, setSingleEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [invites, setInvites] = useState<InviteEntry[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [inviteSendFailures, setInviteSendFailures] = useState<
    { email: string; message: string }[]
  >([]);
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);

  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const isProjectLead = user?.role === 'PROJECT_LEAD';
  const { institutions, isLoadingInstitutions, hasInstitutionsError } = useFetchInstitutions(
    Boolean(isProjectLead)
  );
  const { courseBins, isLoadingCourseBins, hasCourseBinsError } = useFetchInstitutionCourseBins(
    !isProjectLead ? user?.institutionId : undefined
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (
    isLoadingUser ||
    (!isProjectLead && isLoadingCourseBins) ||
    (isProjectLead && isLoadingInstitutions)
  )
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (
    hasUserError ||
    (!isProjectLead && hasCourseBinsError) ||
    (isProjectLead && hasInstitutionsError)
  )
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading resources
      </Box>
    );

  const parseEmails = (raw: string): string[] =>
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes('@'));

  const addEmails = (emails: string[]) => {
    const existing = new Set(invites.map((i) => i.email));
    const newEntries: InviteEntry[] = emails
      .filter((e) => !existing.has(e))
      .map((email) => ({
        email,
        role: 'USER',
        institutionId: isProjectLead ? '' : (user?.institutionId ?? ''),
        courseBinIds: [],
        assignAllRubricsOnAccept: true,
      }));
    if (newEntries.length === 0) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'No new valid emails to add.',
      });
      return;
    }
    setInvites((prev) => [...prev, ...newEntries]);
  };

  const handleUpdateInviteRole = (email: string, role: UserRole) => {
    setInvites((prev) =>
      prev.map((invite) => (invite.email === email ? { ...invite, role } : invite))
    );
  };

  const handleUpdateInviteInstitution = (email: string, institutionId: string) => {
    setInvites((prev) =>
      prev.map((invite) =>
        invite.email === email ? { ...invite, institutionId, courseBinIds: [] } : invite
      )
    );
  };

  const handleAddSingle = () => {
    if (!singleEmail.trim()) return;
    addEmails([singleEmail]);
    setSingleEmail('');
  };

  const handleAddBulk = () => {
    addEmails(parseEmails(bulkEmails));
    setBulkEmails('');
  };

  const handleRemoveInvite = (email: string) => {
    setInvites((prev) => prev.filter((i) => i.email !== email));
  };

  const handleAddBin = (email: string, binId: string) => {
    setInvites((prev) =>
      prev.map((i) =>
        i.email === email && !i.courseBinIds.includes(binId)
          ? { ...i, courseBinIds: [...i.courseBinIds, binId] }
          : i
      )
    );
  };

  const handleRemoveBin = (email: string, binId: string) => {
    setInvites((prev) =>
      prev.map((i) =>
        i.email === email ? { ...i, courseBinIds: i.courseBinIds.filter((b) => b !== binId) } : i
      )
    );
  };

  const handleToggleAssignAllRubrics = (email: string, assignAllRubricsOnAccept: boolean) => {
    setInvites((prev) =>
      prev.map((i) => (i.email === email ? { ...i, assignAllRubricsOnAccept } : i))
    );
  };

  const handleSendInvites = async () => {
    if (!backendUrl || invites.length === 0) return;
    setIsSending(true);
    setInviteSendFailures([]);
    try {
      const results = await Promise.all(
        invites.map(async (invite) => {
          try {
            const response = await fetch(`${backendUrl}/invitations/invite`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: invite.email,
                courseBinIds: invite.courseBinIds,
                role: invite.role,
                institutionId: invite.institutionId,
                assignAllRubricsOnAccept: invite.assignAllRubricsOnAccept,
              }),
            });
            let apiError: string | undefined;
            if (!response.ok) {
              try {
                const data = (await response.json()) as { error?: string };
                apiError = data.error;
              } catch {
                apiError = undefined;
              }
              return {
                email: invite.email,
                success: false as const,
                message: describeInviteApiError(apiError, response.status),
              };
            }
            return { email: invite.email, success: true as const };
          } catch {
            return {
              email: invite.email,
              success: false as const,
              message: 'The request could not be completed. Check your connection and try again.',
            };
          }
        })
      );

      const succeededEmails = new Set(results.filter((row) => row.success).map((row) => row.email));
      const failures = results.filter((row) => !row.success);

      if (succeededEmails.size > 0) {
        snackbarsRef.current?.enqueue({
          status: MessageStatus.SUCCESS,
          message: `${succeededEmails.size} invite${succeededEmails.size > 1 ? 's' : ''} sent successfully.`,
        });
        setInvites((previous) => previous.filter((entry) => !succeededEmails.has(entry.email)));
      }
      if (failures.length > 0) {
        setInviteSendFailures(failures.map((row) => ({ email: row.email, message: row.message })));
      }
    } catch {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to send invites.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const getCourseBinName = (id: string) =>
    (courseBins as CourseBin[]).find((b) => b.id === id)?.displayName ?? id;

  const getAvailableBins = (entry: InviteEntry) =>
    (courseBins as CourseBin[]).filter((b) => !entry.courseBinIds.includes(b.id));

  return (
    <AdminAuthGuard>
      <Box sx={{}}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Invite Users
          </Typography>
          <Button
            variant="outlined"
            startIcon={<GroupIcon />}
            onClick={() => navigate('/admin/users/manage')}
          >
            Manage users
          </Button>
        </Box>

        {/* Mode toggle */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Input Mode
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v) => {
            if (v) setMode(v);
          }}
          size="small"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="single">Single</ToggleButton>
          <ToggleButton value="bulk">Bulk</ToggleButton>
        </ToggleButtonGroup>

        {/* Input area */}
        {mode === 'single' ? (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              value={singleEmail}
              onChange={(e) => setSingleEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddSingle();
              }}
              sx={{ flex: 1, maxWidth: 400 }}
            />
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleAddSingle}>
              Add
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Emails (comma separated)"
              variant="outlined"
              size="small"
              multiline
              minRows={2}
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              sx={{ flex: 1, maxWidth: 500 }}
              placeholder="user1@example.com, user2@example.com"
            />
            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleAddBulk}>
              Add All
            </Button>
          </Box>
        )}

        {!isProjectLead && !user?.institutionId ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You are not attached to an institution yet, so no course bins are available to assign.
          </Alert>
        ) : null}
        {!isProjectLead && user?.institutionId && (courseBins as CourseBin[]).length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No course bins found for your institution. Create bins first to assign invited users to
            bins.
          </Alert>
        ) : null}
        {isProjectLead ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            Project leads can set each invited user&apos;s level and institution.
          </Alert>
        ) : null}

        <hr />
        {/* Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table stickyHeader size="small">
            <TableHead
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <TableRow sx={{ bgcolor: 'background.paper', borderBottom: '1px solid' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Level</TableCell>
                {isProjectLead ? (
                  <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Institution</TableCell>
                ) : null}
                {!isProjectLead ? (
                  <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Course Bins</TableCell>
                ) : null}
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Rubrics</TableCell>
                <TableCell width={40} />
              </TableRow>
            </TableHead>
            <TableBody
              component={Paper}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'theme.palette.background.default',
                elevation: 0,
              }}
            >
              {invites.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={!isProjectLead ? 6 : 5}
                    align="center"
                    sx={{ color: 'text.secondary', py: 4 }}
                  >
                    No users added yet.
                  </TableCell>
                </TableRow>
              ) : (
                invites.map((entry) => (
                  <TableRow key={entry.email}>
                    <TableCell sx={{ verticalAlign: 'middle' }}>{entry.email}</TableCell>
                    <TableCell sx={{ minWidth: 170 }}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Level</InputLabel>
                        <Select
                          label="Level"
                          value={entry.role}
                          onChange={(event) =>
                            handleUpdateInviteRole(entry.email, event.target.value as UserRole)
                          }
                        >
                          {(isProjectLead ? USER_ROLE_OPTIONS : ['USER']).map((roleOption) => (
                            <MenuItem key={roleOption} value={roleOption}>
                              {roleOption}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    {isProjectLead ? (
                      <TableCell sx={{ minWidth: 180 }}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Institution</InputLabel>
                          <Select
                            label="Institution"
                            value={entry.institutionId}
                            onChange={(event) =>
                              handleUpdateInviteInstitution(entry.email, event.target.value)
                            }
                          >
                            <MenuItem value="">
                              <em>Select institution</em>
                            </MenuItem>
                            {institutions.map((institution) => (
                              <MenuItem key={institution.id} value={institution.id}>
                                {formatInstitutionLabel(institution)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    ) : null}
                    {!isProjectLead ? (
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}
                        >
                          {entry.courseBinIds.map((binId) => (
                            <Chip
                              key={binId}
                              label={getCourseBinName(binId)}
                              size="small"
                              onDelete={() => handleRemoveBin(entry.email, binId)}
                            />
                          ))}
                          <FormControl
                            size="small"
                            sx={{ minWidth: 180 }}
                            disabled={getAvailableBins(entry).length === 0}
                          >
                            <InputLabel>
                              {getAvailableBins(entry).length === 0
                                ? 'No course bins available'
                                : '+ Add bin'}
                            </InputLabel>
                            <Select
                              label={
                                getAvailableBins(entry).length === 0
                                  ? 'No course bins available'
                                  : '+ Add bin'
                              }
                              value=""
                              onChange={(e) => handleAddBin(entry.email, e.target.value)}
                            >
                              {getAvailableBins(entry).length === 0 ? (
                                <MenuItem value="" disabled>
                                  No available bins
                                </MenuItem>
                              ) : (
                                getAvailableBins(entry).map((bin) => (
                                  <MenuItem key={bin.id} value={bin.id}>
                                    {bin.displayName}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                          </FormControl>
                        </Box>
                      </TableCell>
                    ) : null}
                    <TableCell sx={{ verticalAlign: 'middle' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={entry.assignAllRubricsOnAccept}
                            onChange={(_, checked) =>
                              handleToggleAssignAllRubrics(entry.email, checked)
                            }
                          />
                        }
                        label="Assign all rubrics on accept"
                        sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: '0.8125rem' } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Remove">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveInvite(entry.email)}
                          color="error"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {inviteSendFailures.length > 0 ? (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setInviteSendFailures([])}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {inviteSendFailures.length === 1
                ? 'One invite could not be sent'
                : `${inviteSendFailures.length} invites could not be sent`}
            </Typography>
            <List dense disablePadding>
              {inviteSendFailures.map((row) => (
                <ListItem key={row.email} disableGutters sx={{ display: 'block', py: 0.25 }}>
                  <ListItemText
                    primary={row.email}
                    secondary={row.message}
                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 600 } }}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
        ) : null}

        {/* Footer actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            disabled={invites.length === 0}
            onClick={() => {
              setInvites([]);
              setInviteSendFailures([]);
            }}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SendIcon />}
            disabled={
              invites.length === 0 ||
              isSending ||
              invites.some((invite) => !invite.institutionId || !invite.role)
            }
            onClick={handleSendInvites}
          >
            {isSending
              ? 'Sending...'
              : `Send ${invites.length > 0 ? `(${invites.length})` : ''} Invites`}
          </Button>
        </Box>
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </AdminAuthGuard>
  );
}
