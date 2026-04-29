import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMemo } from 'react';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import { useFetchAllUsers } from '@utils/hooks/users/useFetchAllUsers';

type UsersByCourseBinAnalyticsChartProps = {
  variant: 'playground' | 'carousel';
};

type CourseBinBucket = {
  label: string;
  value: number;
};

const PLAYGROUND_HEIGHT_PX = 340;
const CAROUSEL_HEIGHT_PX = 140;
const PLAYGROUND_MIN_WIDTH_PX = 980;
const PLAYGROUND_MIN_WIDTH_PER_CATEGORY_PX = 96;
const UNASSIGNED_BUCKET_LABEL = 'Unassigned';
const COURSE_BIN_TICK_LABEL_MAX_LENGTH = 18;

function formatCourseBinTickLabel(label: string): string {
  if (label.length <= COURSE_BIN_TICK_LABEL_MAX_LENGTH) {
    return label;
  }
  return `${label.slice(0, COURSE_BIN_TICK_LABEL_MAX_LENGTH - 1)}…`;
}

function buildUsersByCourseBinBuckets({
  usersWithCourseBins,
  institutionCourseBins,
}: {
  usersWithCourseBins: Array<{ userCourseBins: { courseBinId: string }[] }>;
  institutionCourseBins: Array<{ id: string; displayName: string }>;
}): CourseBinBucket[] {
  const countByCourseBinId = new Map<string, number>();
  let unassignedCount = 0;

  for (const user of usersWithCourseBins) {
    const assignedCourseBinIds = user.userCourseBins.map(
      (courseBinRow) => courseBinRow.courseBinId
    );
    if (assignedCourseBinIds.length === 0) {
      unassignedCount += 1;
      continue;
    }
    for (const courseBinId of assignedCourseBinIds) {
      countByCourseBinId.set(courseBinId, (countByCourseBinId.get(courseBinId) ?? 0) + 1);
    }
  }

  const buckets = institutionCourseBins.map((courseBin) => ({
    label: courseBin.displayName,
    value: countByCourseBinId.get(courseBin.id) ?? 0,
  }));

  if (unassignedCount > 0) {
    buckets.push({ label: UNASSIGNED_BUCKET_LABEL, value: unassignedCount });
  }

  return buckets;
}

export default function UsersByCourseBinAnalyticsChart({
  variant,
}: UsersByCourseBinAnalyticsChartProps) {
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { users, isLoadingUsers, hasUsersError } = useFetchAllUsers();
  const { courseBins, isLoadingCourseBins, hasCourseBinsError } = useFetchInstitutionCourseBins(
    user?.institutionId
  );

  const usersByCourseBinBuckets = useMemo(
    () =>
      buildUsersByCourseBinBuckets({
        usersWithCourseBins: users,
        institutionCourseBins: courseBins,
      }),
    [courseBins, users]
  );

  const isLoading = isLoadingUser || isLoadingUsers || isLoadingCourseBins;
  const hasError = hasUserError || hasUsersError || hasCourseBinsError;
  const hasAnyUsers = users.length > 0;
  const heightPx = variant === 'playground' ? PLAYGROUND_HEIGHT_PX : CAROUSEL_HEIGHT_PX;
  const chartWidthPx = Math.max(
    PLAYGROUND_MIN_WIDTH_PX,
    usersByCourseBinBuckets.length * PLAYGROUND_MIN_WIDTH_PER_CATEGORY_PX
  );

  if (isLoading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 2 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading users by course bin…
        </Typography>
      </Stack>
    );
  }

  if (hasError) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        Could not load users by course bin.
      </Alert>
    );
  }

  if (!hasAnyUsers) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
        No users
      </Typography>
    );
  }

  if (variant === 'playground') {
    return (
      <Box sx={{ width: chartWidthPx, minWidth: chartWidthPx, maxWidth: 'none' }}>
        <BarChart
          dataset={usersByCourseBinBuckets}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'label',
              tickLabelStyle: { fontSize: 11 },
              valueFormatter: (value) => formatCourseBinTickLabel(String(value)),
            },
          ]}
          yAxis={[{ label: 'Users' }]}
          series={[{ type: 'bar', dataKey: 'value', label: 'Users' }]}
          width={chartWidthPx}
          height={heightPx}
          sx={{ width: chartWidthPx }}
          margin={{ left: 48, right: 16, top: 8, bottom: 44 }}
        />
      </Box>
    );
  }

  return (
    <BarChart
      dataset={usersByCourseBinBuckets}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'label',
          tickLabelStyle: { fontSize: 11 },
          valueFormatter: (value) => formatCourseBinTickLabel(String(value)),
        },
      ]}
      yAxis={[{ label: '' }]}
      series={[{ type: 'bar', dataKey: 'value', label: 'Users' }]}
      height={heightPx}
      sx={{ width: 1 }}
      margin={{ left: 32, right: 8, top: 4, bottom: 32 }}
    />
  );
}
