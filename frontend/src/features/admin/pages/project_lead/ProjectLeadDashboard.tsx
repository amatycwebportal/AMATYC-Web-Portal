import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { useNavigate } from 'react-router-dom';
import { ProjectLeadAuthGuard } from '../../Middleware/auth';
import { DashboardActionCard, type DashboardAction } from '../../components/DashboardActionCard';
import { sharedDashboardIconStyles } from '../../components/dashboardSharedIconStyles';
import { PlaceholderVideoCard } from '../../../help/PlaceholderVideoCard';
import { PLACEHOLDER_VIDEOS } from '@shared/placeholderVideos';

const PROJECT_LEAD_DASHBOARD_ACTIONS: DashboardAction[] = [
  {
    title: 'Rubrics',
    description: 'Open the project-wide rubric library to review or edit templates.',
    path: '/admin/project-lead/rubrics',
    ...sharedDashboardIconStyles.rubrics,
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
    title: 'Users',
    description: 'Invite users, choose their level, and manage user access across institutions.',
    path: '/admin/users',
    ...sharedDashboardIconStyles.users,
  },
  {
    title: 'Export responses',
    description:
      'Download merged submitted response data as CSV (Excel-ready), filtered by rubric, section, and scale, across all institutions.',
    path: '/admin/export/responses',
    ...sharedDashboardIconStyles.exportResponses,
  },
  {
    title: 'Review consensus',
    description:
      'Pick an institution and rubric to view submitted College lead consensus with institution self-assessment histograms.',
    path: '/admin/project-lead/consensus-review',
    icon: FactCheckOutlinedIcon,
    iconBackgroundColor: 'info.light',
    iconColor: 'info.dark',
  },
  {
    title: 'Manage assignments',
    description: 'Review assignment status by user and send completion reminders.',
    path: '/admin/project-lead/rubrics/manage-assignments',
    ...sharedDashboardIconStyles.rubrics,
  },
];

export default function ProjectLeadDashboard() {
  const navigate = useNavigate();

  return (
    <ProjectLeadAuthGuard>
      <Box sx={{ maxWidth: 1080, mx: 'auto' }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Administrator dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
            Choose an area below. Each card opens the corresponding admin tool for portal-wide
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

        <Stack spacing={2} sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Training
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PlaceholderVideoCard video={PLACEHOLDER_VIDEOS.administratorTraining} />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </ProjectLeadAuthGuard>
  );
}
