import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppTheme from '../../../theme/AppTheme';
import ColorModeSelect from '../../../theme/ColorModeSelect';
import logo from '../../../assets/TPSE-logo.png';
import PrivacyNoticeDocument from '../components/PrivacyNoticeDocument';
import { PRIVACY_NOTICE_POPUP } from '../content/privacyNoticeContent';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { executeAcceptPrivacyConsent } from '@utils/hooks/auth/executeAcceptPrivacyConsent';
import { executeAcceptPendingPrivacyConsent } from '@utils/hooks/auth/privacyConsentClient';
import { hasAcceptedPrivacyConsent } from '@shared/privacyPolicy';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  maxWidth: 960,
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const PageContainer = styled(Stack)(({ theme }) => ({
  minHeight: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
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

function getSafeReturnTo(returnToParam: string | null): string {
  if (!returnToParam || !returnToParam.startsWith('/') || returnToParam.startsWith('//')) {
    return '/sign-in';
  }
  return returnToParam;
}

export default function PrivacyConsent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = getSafeReturnTo(searchParams.get('returnTo'));
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { user, isLoadingUser } = useFetchUser({
    skipConsentRedirect: true,
    skipAuthRedirect: true,
  });
  const [hasAgreed, setHasAgreed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isLoadingUser || !user) {
      return;
    }
    if (hasAcceptedPrivacyConsent(user)) {
      navigate(returnTo, { replace: true });
    }
  }, [isLoadingUser, navigate, returnTo, user]);

  const handleAccept = async () => {
    if (!backendUrl) {
      setSubmitError('Backend URL is not configured.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (user) {
        await executeAcceptPrivacyConsent(backendUrl);
      } else {
        await executeAcceptPendingPrivacyConsent(backendUrl);
      }
      navigate(returnTo, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to record consent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!backendUrl) {
    return <Typography color="error">Backend URL is not configured.</Typography>;
  }

  if (isLoadingUser) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100dvh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <PageContainer direction="column" justifyContent="center" alignItems="center">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box component="img" src={logo} alt="TPSE Logo" sx={{ maxWidth: 280, width: '100%' }} />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
              {PRIVACY_NOTICE_POPUP.title}
            </Typography>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              maxHeight: '50vh',
              overflowY: 'auto',
              p: 3,
              bgcolor: 'background.default',
            }}
          >
            <PrivacyNoticeDocument />
          </Paper>

          <FormControlLabel
            control={
              <Checkbox
                checked={hasAgreed}
                onChange={(event) => setHasAgreed(event.target.checked)}
              />
            }
            label={PRIVACY_NOTICE_POPUP.participant_consent.instruction}
          />

          {submitError ? (
            <Typography color="error" variant="body2">
              {submitError}
            </Typography>
          ) : null}

          <Button
            variant="contained"
            size="large"
            disabled={
              (PRIVACY_NOTICE_POPUP.actions.agree.required_for_consent && !hasAgreed) ||
              isSubmitting
            }
            onClick={() => void handleAccept()}
          >
            {isSubmitting ? 'Saving…' : PRIVACY_NOTICE_POPUP.actions.agree.label}
          </Button>
        </Card>
      </PageContainer>
    </AppTheme>
  );
}
