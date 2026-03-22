import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdminAuthGuard } from '../../Middleware/auth';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function LocalLeadDashboard() {
  const navigate = useNavigate();
  return (
    <AdminAuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Local Leader Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/local-leader/rubrics')}
        >
          View All Rubrics
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/local-leader/rubrics/assignment')}
        >
          Assign Rubrics
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/local-leader/course-bins')}
        >
          Course Bins
        </Button>
      </Box>
    </AdminAuthGuard>
  );
}
