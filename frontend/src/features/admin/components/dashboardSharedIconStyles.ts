import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
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
  courseBins: {
    icon: ViewModuleOutlinedIcon,
    iconBackgroundColor: 'secondary.light',
    iconColor: 'secondary.dark',
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
