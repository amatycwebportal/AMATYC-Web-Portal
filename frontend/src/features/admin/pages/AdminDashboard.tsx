import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdminAuthGuard } from '../Middleware/auth';
export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Admin Dashboard
        </Typography>
      </Box>
    </AdminAuthGuard>
  );
}
