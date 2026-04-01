import * as React from 'react';
import { Box, Button, Divider, Typography, Stack } from '@mui/material';

import CssBaseline from '@mui/material/CssBaseline';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../components/ForgotPassword';
import AppTheme from '../../../theme/AppTheme.tsx';
import ColorModeSelect from '../../../theme/ColorModeSelect.tsx';
import { GoogleIcon } from '../components/CustomIcons';
import logo from '../../../assets/TPSE-logo.png';
import { useSearchParams } from 'react-router-dom';
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.error('VITE_BACKEND_URL is not configured.');
    return <div>Error loading backend URL</div>;
  }

  const handleClose = () => setOpen(false);

  const handleGoogleSignIn = () => {
    if (!backendUrl) {
      console.error('VITE_BACKEND_URL is not configured.');
      return;
    }
    const url = token ? `${backendUrl}/auth/google?token=${token}` : `${backendUrl}/auth/google`;
    window.location.href = url;
  };

  if (!backendUrl) return <div>Error loading backend URL</div>;

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="center" alignItems="center">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <img src={logo} alt="TPSE Logo" style={{ width: '100%', height: '100%' }} />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <ForgotPassword open={open} handleClose={handleClose} />
          <Divider>Continue with</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Sign up and sign in are both handled with Google.
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
