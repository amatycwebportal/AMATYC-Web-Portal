import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { useNavigate } from 'react-router-dom';
import { LocalLeaderAuthGuard } from '../../Middleware/auth';
import { DashboardActionCard, type DashboardAction } from '../../components/DashboardActionCard';
import { sharedDashboardIconStyles } from '../../components/dashboardSharedIconStyles';
import { PlaceholderVideoCard } from '../../../help/PlaceholderVideoCard';
import { PLACEHOLDER_VIDEOS } from '@shared/placeholderVideos';

const LOCAL_LEADER_DASHBOARD_ACTIONS: DashboardAction[] = [
  {
    title: 'Users',
    description: 'Invite colleagues and manage who has access at your institution.',
    path: '/admin/users',
    ...sharedDashboardIconStyles.users,
  },
  {
    title: 'Rubrics',
    description: 'Browse rubric templates available to your institution.',
    path: '/admin/local-leader/rubrics',
    ...sharedDashboardIconStyles.rubrics,
  },
  {
    title: 'Assign rubrics',
    description: 'Connect rubrics to people and pathways for your institution.',
    path: '/admin/local-leader/rubrics/assignment',
    icon: AssignmentTurnedInOutlinedIcon,
    iconBackgroundColor: 'info.light',
    iconColor: 'info.dark',
  },
  {
    title: 'Manage rubric assignments',
    description:
      'View assignment counts by user and rubric, send reminders, and unassign work in progress.',
    path: '/admin/local-leader/rubrics/manage-assignments',
    icon: GridViewOutlinedIcon,
    iconBackgroundColor: 'info.main',
    iconColor: 'info.contrastText',
  },
  {
    title: 'Analytics',
    description:
      'Users and responses, date filters, metrics, and a chart workspace with a carousel for saved views.',
    path: '/admin/local-leader/analytics',
    icon: InsightsOutlinedIcon,
    iconBackgroundColor: 'warning.light',
    iconColor: 'warning.dark',
  },
  {
    title: 'Export responses',
    description:
      'Download submitted response data as CSV (Excel-ready) for your institution, filtered by rubric, section, and scale.',
    path: '/admin/export/responses',
    ...sharedDashboardIconStyles.exportResponses,
  },
  {
    title: 'Consensus meeting',
    description: 'Run calibration and alignment sessions with your rating team.',
    path: '/admin/local-leader/consensus-meeting',
    icon: GroupsOutlinedIcon,
    iconBackgroundColor: 'action.hover',
    iconColor: 'primary.main',
  },
];

export default function LocalLeadDashboard() {
  const navigate = useNavigate();

  return (
    <LocalLeaderAuthGuard>
      <Box sx={{ maxWidth: 1080, mx: 'auto' }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            College lead dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
            Quick links for rubrics, people, and institution-level tools. Open a card to go straight
            to that workflow.
          </Typography>
        </Stack>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {LOCAL_LEADER_DASHBOARD_ACTIONS.map((action) => (
            <Grid key={action.path} size={{ xs: 12, sm: 6, md: 4 }}>
              <DashboardActionCard action={action} onSelect={(path) => navigate(path)} />
            </Grid>
          ))}
        </Grid>

        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Training
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
            Play the first-time walkthrough with a new colleague, then use the access video when you
            decide which pathways and rubrics they should see.
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PlaceholderVideoCard video={PLACEHOLDER_VIDEOS.collegeLeadAccess} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <PlaceholderVideoCard video={PLACEHOLDER_VIDEOS.firstTimeWalkthrough} />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </LocalLeaderAuthGuard>
  );
}
