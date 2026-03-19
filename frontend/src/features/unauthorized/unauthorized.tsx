import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Contact Section (for admins/support)
// -------------------------------------
// If you believe this is an error or need access, please contact:
//   - Project Admin: admin@example.com
//   - Support Desk: support@example.com
//   - Local Leader: (per institution)
// -------------------------------------

export default function Unauthorized() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/profile', { replace: true });
    }, 30000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 8,
        p: 4,
        boxShadow: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        You are not authorized to access the requested page.
      </Typography>
      {/* See contact info block above */}
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        If you believe you should have access, please contact support (see comment in code).
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        You will be redirected to your profile page in 30 seconds if you take no action.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/profile', { replace: true })}
      >
        Go to My Profile
      </Button>
    </Box>
  );
}
