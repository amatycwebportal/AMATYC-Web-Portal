import {
  Box,
  Button,
  Chip,
  FormControl,
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
import type { CourseBin } from '@shared/types';

interface InviteEntry {
  email: string;
  courseBinIds: string[];
}

export default function InviteUsers() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [singleEmail, setSingleEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [invites, setInvites] = useState<InviteEntry[]>([]);
  const [isSending, setIsSending] = useState(false);
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);

  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { courseBins, isLoadingCourseBins, hasCourseBinsError } = useFetchInstitutionCourseBins(
    user ? user.institutionId : undefined
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (isLoadingCourseBins || isLoadingUser) return <div>Loading...</div>;
  if (hasCourseBinsError || hasUserError) return <div>Error loading resources</div>;

  const parseEmails = (raw: string): string[] =>
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes('@'));

  const addEmails = (emails: string[]) => {
    const existing = new Set(invites.map((i) => i.email));
    const newEntries: InviteEntry[] = emails
      .filter((e) => !existing.has(e))
      .map((email) => ({ email, courseBinIds: [] }));
    if (newEntries.length === 0) {
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'No new valid emails to add.',
      });
      return;
    }
    setInvites((prev) => [...prev, ...newEntries]);
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

  const handleSendInvites = async () => {
    if (!backendUrl || invites.length === 0) return;
    setIsSending(true);
    try {
      const results = await Promise.allSettled(
        invites.map(async (invite) => {
          const response = await fetch(`${backendUrl}/invitations/invite`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: invite.email,
              courseBinIds: invite.courseBinIds,
              role: 'USER',
              institutionId: user?.institutionId,
              invitedByUserId: user?.id,
            }),
          });
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error ?? `Failed for ${invite.email}`);
          }
          return invite.email;
        })
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      const succeeded = results.length - failed;

      if (succeeded > 0) {
        snackbarsRef.current?.enqueue({
          status: MessageStatus.SUCCESS,
          message: `${succeeded} invite${succeeded > 1 ? 's' : ''} sent successfully.`,
        });
        setInvites([]);
      }
      if (failed > 0) {
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: `${failed} invite${failed > 1 ? 's' : ''} failed to send.`,
        });
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

  const getBinName = (id: string) =>
    (courseBins as CourseBin[]).find((b) => b.id === id)?.displayName ?? id;

  const availableBins = (entry: InviteEntry) =>
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

        <hr />
        {/* Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Course Bins</TableCell>
                <TableCell width={40} />
              </TableRow>
            </TableHead>
            <TableBody>
              {invites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No users added yet.
                  </TableCell>
                </TableRow>
              ) : (
                invites.map((entry) => (
                  <TableRow key={entry.email}>
                    <TableCell sx={{ verticalAlign: 'middle' }}>{entry.email}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}
                      >
                        {entry.courseBinIds.map((binId) => (
                          <Chip
                            key={binId}
                            label={getBinName(binId)}
                            size="small"
                            onDelete={() => handleRemoveBin(entry.email, binId)}
                          />
                        ))}
                        {availableBins(entry).length > 0 && (
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>+ Add bin</InputLabel>
                            <Select
                              label="+ Add bin"
                              value=""
                              onChange={(e) => handleAddBin(entry.email, e.target.value)}
                            >
                              {availableBins(entry).map((bin) => (
                                <MenuItem key={bin.id} value={bin.id}>
                                  {bin.displayName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </Box>
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

        {/* Footer actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            disabled={invites.length === 0}
            onClick={() => setInvites([])}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SendIcon />}
            disabled={invites.length === 0 || isSending}
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
