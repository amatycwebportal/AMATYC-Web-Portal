import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { useNavigate } from 'react-router-dom';
import { ProjectLeadAuthGuard } from '../../Middleware/auth';
import { DashboardActionCard, type DashboardAction } from '../../components/DashboardActionCard';

const PROJECT_LEAD_DASHBOARD_ACTIONS: DashboardAction[] = [
  {
    title: 'Rubrics',
    description: 'Open the project-wide rubric library to review or edit templates.',
    path: '/admin/project-lead/rubrics',
    icon: RateReviewOutlinedIcon,
    iconBackgroundColor: 'primary.light',
    iconColor: 'primary.dark',
  },
  {
    title: 'Predefined course bins',
    description: 'Configure shared course groupings used when assigning rubrics and courses.',
    path: '/admin/project-lead/course-bins',
    icon: ViewModuleOutlinedIcon,
    iconBackgroundColor: 'secondary.light',
    iconColor: 'secondary.dark',
  },
  {
    title: 'Institutions',
    description: 'Add or manage institutions that participate in the project.',
    path: '/admin/institutions',
    icon: DomainAddOutlinedIcon,
    iconBackgroundColor: 'success.light',
    iconColor: 'success.dark',
  },
  {
    title: 'Export responses',
    description:
      'Download merged submitted response data as CSV (Excel-ready), filtered by rubric, section, and scale, across all institutions.',
    path: '/admin/export/responses',
    icon: FileDownloadOutlinedIcon,
    iconBackgroundColor: 'warning.light',
    iconColor: 'warning.dark',
  },
  {
    title: 'Review consensus',
    description:
      'Pick an institution and rubric to view submitted local-leader consensus with institution self-assessment histograms.',
    path: '/admin/project-lead/consensus-review',
    icon: FactCheckOutlinedIcon,
    iconBackgroundColor: 'info.light',
    iconColor: 'info.dark',
  },
];

export default function ProjectLeadDashboard() {
  const navigate = useNavigate();

  return (
    <ProjectLeadAuthGuard>
      <Box sx={{ maxWidth: 1080, mx: 'auto' }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Project lead dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
            Choose an area below. Each card opens the corresponding admin tool for project-wide
            setup and content.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {PROJECT_LEAD_DASHBOARD_ACTIONS.map((action) => (
            <Grid key={action.path} size={{ xs: 12, sm: 6, md: 4 }}>
              <DashboardActionCard action={action} onSelect={(path) => navigate(path)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ProjectLeadAuthGuard>
  );
}
