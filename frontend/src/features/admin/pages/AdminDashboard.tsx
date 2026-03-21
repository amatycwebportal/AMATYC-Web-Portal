import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdminAuthGuard } from '../Middleware/auth';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <AdminAuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Admin Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/rubrics')}>
          View All Rubrics
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/rubrics/template')}
        >
          View Rubric Template
        </Button>
      </Box>
    </AdminAuthGuard>
  );
}
