import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ProjectLeadAuthGuard } from '../../Middleware/auth';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function ProjectLeadDashboard() {
  const navigate = useNavigate();
  return (
    <ProjectLeadAuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Project Lead Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/project-lead/rubrics')}
        >
          View All Rubrics
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/project-lead/course-bins')}
        >
          View All Predefined Course Bins
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/institutions')}>
          Create Institution
        </Button>
      </Box>
    </ProjectLeadAuthGuard>
  );
}
