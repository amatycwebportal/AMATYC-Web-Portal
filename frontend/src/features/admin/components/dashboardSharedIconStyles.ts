import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import type { DashboardAction } from './DashboardActionCard';

type SharedDashboardIconStyle = Pick<DashboardAction, 'icon' | 'iconBackgroundColor' | 'iconColor'>;

export const sharedDashboardIconStyles = {
  rubrics: {
    icon: RateReviewOutlinedIcon,
    iconBackgroundColor: 'primary.light',
    iconColor: 'primary.dark',
  },
  users: {
    icon: PeopleOutlineIcon,
    iconBackgroundColor: 'grey.200',
    iconColor: 'grey.800',
  },
  exportResponses: {
    icon: FileDownloadOutlinedIcon,
    iconBackgroundColor: 'warning.light',
    iconColor: 'warning.dark',
  },
} satisfies Record<string, SharedDashboardIconStyle>;
