import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Admin
      </Typography>
      <Typography color="text.secondary">
        This is the admin area. Content will be added here based on admin
        permissions.
      </Typography>
    </Box>
  );
}

