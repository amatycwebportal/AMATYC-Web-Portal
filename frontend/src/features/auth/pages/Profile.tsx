import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { isTpseAdminEmail } from '@shared/tpseAdmin';
import { useFetchUser } from '../../../utils/hooks/auth/useFetchUser';
import { useLogout } from '../../../utils/hooks/auth/useLogout';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoadingUser, hasUserError } = useFetchUser();
  const { executeLogout } = useLogout();

  const getPrimaryEmail = () => {
    if (!user?.email) {
      return '';
    }
    return user.email;
  };

  const getAvatarUrl = () => {
    if (!user?.avatarUrl) {
      return '';
    }
    return user.avatarUrl;
  };

  const canOpenTpseAdmin = isTpseAdminEmail(user?.email);

  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoadingUser ? (
        <CircularProgress />
      ) : hasUserError ? (
        <Typography color="error">Something went wrong while loading your profile.</Typography>
      ) : !user ? (
        <Typography>No user information available.</Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Avatar
            src={getAvatarUrl()}
            alt={user.name ?? ''}
            sx={{ width: 72, height: 72, mb: 1 }}
          />
          <Typography variant="h5" sx={{ color: 'text.primary' }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getPrimaryEmail()}
          </Typography>
          {canOpenTpseAdmin && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AdminPanelSettingsOutlinedIcon />}
              sx={{ mt: 1 }}
              onClick={() => navigate('/admin/tpse-admin')}
            >
              TPSE Admin
            </Button>
          )}
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: canOpenTpseAdmin ? 0 : 2 }}
            onClick={executeLogout}
          >
            Sign out
          </Button>
        </Box>
      )}
    </Box>
  );
}
