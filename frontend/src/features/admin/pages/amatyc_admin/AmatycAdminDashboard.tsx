import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DomainDisabledOutlinedIcon from '@mui/icons-material/DomainDisabledOutlined';
import { useNavigate } from 'react-router-dom';
import { AmatycAdminAuthGuard } from '../../Middleware/auth';
import { DashboardActionCard, type DashboardAction } from '../../components/DashboardActionCard';

const AMATYC_ADMIN_DASHBOARD_ACTIONS: DashboardAction[] = [
  {
    title: 'Delete users',
    description:
      'Permanently remove a user account and review linked responses and assignments first.',
    path: '/admin/amatyc-admin/users',
    icon: DeleteOutlineIcon,
    iconBackgroundColor: 'error.light',
    iconColor: 'error.dark',
  },
  {
    title: 'Delete institutions',
    description:
      'Remove an institution and its course bins. Users are detached, not deleted; review cascade impact first.',
    path: '/admin/amatyc-admin/institutions',
    icon: DomainDisabledOutlinedIcon,
    iconBackgroundColor: 'warning.light',
    iconColor: 'warning.dark',
  },
];

export default function AmatycAdminDashboard() {
  const navigate = useNavigate();

  return (
    <AmatycAdminAuthGuard>
      <Box>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            AMATYC Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Destructive maintenance tools. Every delete shows linked data that will be removed or
            unlinked before you confirm.
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {AMATYC_ADMIN_DASHBOARD_ACTIONS.map((action) => (
            <Grid key={action.path} size={{ xs: 12, sm: 6, md: 4 }}>
              <DashboardActionCard action={action} onSelect={(path) => navigate(path)} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </AmatycAdminAuthGuard>
  );
}
