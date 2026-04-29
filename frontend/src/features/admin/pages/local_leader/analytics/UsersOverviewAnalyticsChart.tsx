import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';
import { useFetchAllUsers } from '@utils/hooks/users/useFetchAllUsers';

type UsersOverviewAnalyticsChartProps = {
  variant: 'playground' | 'carousel';
};

type RoleBucket = {
  label: string;
  value: number;
};

const PLAYGROUND_HEIGHT_PX = 340;
const CAROUSEL_HEIGHT_PX = 140;
const PLAYGROUND_MIN_WIDTH_PX = 980;
const PLAYGROUND_MIN_WIDTH_PER_CATEGORY_PX = 92;
const EMPTY_LABEL = 'No users';

function buildRoleBuckets(
  totalUsers: number,
  totalLeads: number,
  totalFaculty: number
): RoleBucket[] {
  return [
    { label: 'Users', value: totalUsers },
    { label: 'Local leads', value: totalLeads },
    { label: 'Faculty', value: totalFaculty },
  ];
}

export default function UsersOverviewAnalyticsChart({ variant }: UsersOverviewAnalyticsChartProps) {
  const { users, isLoadingUsers, hasUsersError } = useFetchAllUsers();

  const roleBuckets = useMemo(() => {
    const totalUsers = users.length;
    const totalLeads = users.filter((user) => user.role === 'LOCAL_LEADER').length;
    const totalFaculty = users.filter((user) => user.role === 'FACULTY').length;
    return buildRoleBuckets(totalUsers, totalLeads, totalFaculty);
  }, [users]);

  const heightPx = variant === 'playground' ? PLAYGROUND_HEIGHT_PX : CAROUSEL_HEIGHT_PX;
  const chartWidthPx = Math.max(
    PLAYGROUND_MIN_WIDTH_PX,
    roleBuckets.length * PLAYGROUND_MIN_WIDTH_PER_CATEGORY_PX
  );
  const hasAnyUsers = roleBuckets[0]?.value !== 0;

  if (isLoadingUsers) {
    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading users overview…
        </Typography>
      </Stack>
    );
  }

  if (hasUsersError) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        Could not load users overview.
      </Alert>
    );
  }

  if (!hasAnyUsers) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
        {EMPTY_LABEL}
      </Typography>
    );
  }

  if (variant === 'playground') {
    return (
      <Box sx={{ width: chartWidthPx, minWidth: chartWidthPx, maxWidth: 'none' }}>
        <BarChart
          dataset={roleBuckets}
          xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
          yAxis={[{ label: 'Users' }]}
          series={[{ type: 'bar', dataKey: 'value', label: 'Users' }]}
          width={chartWidthPx}
          height={heightPx}
          sx={{ width: chartWidthPx }}
          margin={{ left: 48, right: 16, top: 8, bottom: 36 }}
        />
      </Box>
    );
  }

  return (
    <BarChart
      dataset={roleBuckets}
      xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
      yAxis={[{ label: '' }]}
      series={[{ type: 'bar', dataKey: 'value', label: 'Users' }]}
      height={heightPx}
      sx={{ width: 1 }}
      margin={{ left: 32, right: 8, top: 4, bottom: 28 }}
    />
  );
}
