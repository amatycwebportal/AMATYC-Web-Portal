import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { User } from '../../../../../shared/types';
export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const executeFetchUser = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        // eslint-disable-next-line no-console
        console.error('VITE_BACKEND_URL is not configured.');
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/auth/user`, {
          credentials: 'include',
        });

        if (response.status === 401) {
          navigate('/sign-in');
          return;
        }

        if (!response.ok) {
          setHasError(true);
          return;
        }

        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user as User);
        } else {
          navigate('/sign-in');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load user profile', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    executeFetchUser();
  }, [navigate]);

  const executeLogout = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      // eslint-disable-next-line no-console
      console.error('VITE_BACKEND_URL is not configured.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok && response.status !== 204) {
        // eslint-disable-next-line no-console
        console.error('Failed to log out.');
        return;
      }

      navigate('/sign-in');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to log out.', error);
    }
  };

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

  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : hasError ? (
        <Typography color="error">
          Something went wrong while loading your profile.
        </Typography>
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
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={executeLogout}
          >
            Sign out
          </Button>
        </Box>
      )}
    </Box>
  );
}

