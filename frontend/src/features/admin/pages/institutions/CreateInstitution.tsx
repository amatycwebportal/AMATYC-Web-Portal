import Box from '@mui/material/Box';
import { AdminAuthGuard } from '../../Middleware/auth';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef } from 'react';
export default function CreateInstitution() {
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const [localLeaderName, setLocalLeaderName] = useState('');
  const [localLeaderEmail, setLocalLeaderEmail] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  if (isLoadingUser) {
    return <div>Loading...</div>;
  }
  if (hasUserError) {
    return <div>Error loading user</div>;
  }
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.error('VITE_BACKEND_URL is not configured.');
    return;
  }

  const handleCreateInstitution = async () => {
    try {
      const response = await fetch(`${backendUrl}/institutions/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: institutionName,
          localLeaderName: localLeaderName,
          localLeaderEmail: localLeaderEmail,
          invitedByuser: user,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: 'Failed to create institution: ' + data.error,
        });
        return;
      }
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: 'Institution created successfully',
      });
    } catch (error) {
      console.error('Failed to create institution:', JSON.stringify(error, null, 2));
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to create institution',
      });
    }
  };
  return (
    <AdminAuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Create Institution
        </Typography>
      </Box>
      <Box>
        <TextField
          label="Institution Name"
          variant="outlined"
          fullWidth
          required
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)}
        />
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Local Leader
          </Typography>
          <TextField
            label="Local Leader Name"
            variant="outlined"
            sx={{ mb: 2 }}
            value={localLeaderName}
            onChange={(e) => setLocalLeaderName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Local Leader Email"
            variant="outlined"
            fullWidth
            required
            value={localLeaderEmail}
            onChange={(e) => setLocalLeaderEmail(e.target.value)}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleCreateInstitution()}
          disabled={!institutionName || !localLeaderName || !localLeaderEmail}
        >
          Create Institution
        </Button>
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </AdminAuthGuard>
  );
}
