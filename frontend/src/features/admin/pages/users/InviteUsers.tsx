import { Box, Button, TextField, Typography } from '@mui/material';
import { AdminAuthGuard } from '../../Middleware/auth';
import { useRef, useState } from 'react';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';

export default function InviteUsers() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [institution, setInstitution] = useState('');
  const [name, setName] = useState('');
  const [courses, setCourses] = useState<string[]>([]);
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.error('VITE_BACKEND_URL is not configured.');
    return;
  }
  const handleInvite = async () => {
    try {
      const response = await fetch(`${backendUrl}/users/invite`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to invite user:', JSON.stringify(error, null, 2));
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: 'Failed to invite user',
      });
    }
  };
  return (
    <AdminAuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Invite Users
        </Typography>
      </Box>
      <Box>
        <TextField label="Email" variant="outlined" />
        <Button variant="contained" color="primary">
          Invite
        </Button>
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </AdminAuthGuard>
  );
}
