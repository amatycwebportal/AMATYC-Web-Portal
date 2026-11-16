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
import logo from '../../../assets/AMATYC-logo.png';
import PrivacyNoticeDocument from '../components/PrivacyNoticeDocument';
import { PRIVACY_NOTICE_POPUP } from '../content/privacyNoticeContent';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { executeAcceptPrivacyConsent } from '@utils/hooks/auth/executeAcceptPrivacyConsent';
import {
  executeAcceptPendingSignIn,
  executeDeclinePrivacyConsent,
  executeFetchPendingSignIn,
  type PendingSignIn,
} from '@utils/hooks/auth/privacyConsentClient';
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

const DEFAULT_RETURN_PATH = '/rubrics/assigned';
const SIGN_IN_PATH = '/sign-in';
const DECLINED_SIGN_IN_PATH = '/sign-in?consent=declined';

function getSafeReturnTo(returnToParam: string | null): string {
  if (!returnToParam || !returnToParam.startsWith('/') || returnToParam.startsWith('//')) {
    return DEFAULT_RETURN_PATH;
  }
  return returnToParam;
}

async function executeAcceptConsent(params: {
  backendUrl: string;
  hasPendingSignIn: boolean;
  returnTo: string;
}): Promise<string> {
  if (params.hasPendingSignIn) {
    const { redirectPath } = await executeAcceptPendingSignIn(params.backendUrl);
    return redirectPath;
  }
  await executeAcceptPrivacyConsent(params.backendUrl);
  return params.returnTo;
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
  const [pendingSignIn, setPendingSignIn] = React.useState<PendingSignIn | null>(null);
  const [isLoadingPendingSignIn, setIsLoadingPendingSignIn] = React.useState(true);

  React.useEffect(() => {
    if (!backendUrl) {
      setIsLoadingPendingSignIn(false);
      return;
    }
    executeFetchPendingSignIn(backendUrl)
      .then(setPendingSignIn)
      .catch(() => setSubmitError('Could not check your sign-in. Please try again.'))
      .finally(() => setIsLoadingPendingSignIn(false));
  }, [backendUrl]);

  const hasPendingSignIn = Boolean(pendingSignIn?.hasPendingSignIn);

  React.useEffect(() => {
    if (isLoadingUser || isLoadingPendingSignIn || hasPendingSignIn) {
      return;
    }
    if (!user) {
      navigate(SIGN_IN_PATH, { replace: true });
      return;
    }
    if (hasAcceptedPrivacyConsent(user)) {
      navigate(returnTo, { replace: true });
    }
  }, [hasPendingSignIn, isLoadingPendingSignIn, isLoadingUser, navigate, returnTo, user]);

  const handleAccept = async () => {
    if (!backendUrl) {
      setSubmitError('Backend URL is not configured.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const destination = await executeAcceptConsent({ backendUrl, hasPendingSignIn, returnTo });
      navigate(destination, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to record consent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!backendUrl) {
      return;
    }
    setIsSubmitting(true);
    try {
      await executeDeclinePrivacyConsent(backendUrl);
      navigate(DECLINED_SIGN_IN_PATH, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to sign out.');
      setIsSubmitting(false);
    }
  };

  if (!backendUrl) {
    return <Typography color="error">Backend URL is not configured.</Typography>;
  }

  if (isLoadingUser || isLoadingPendingSignIn) {
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
            <Box
              component="img"
              src={logo}
              alt="AMATYC Logo"
              sx={{ maxWidth: 280, width: '100%' }}
            />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
              {PRIVACY_NOTICE_POPUP.title}
            </Typography>
            {pendingSignIn?.email ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                Signed in with Google as {pendingSignIn.email}. Accept the notice to continue, or
                decline to sign out.
              </Typography>
            ) : null}
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

          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={2}>
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              disabled={isSubmitting}
              onClick={() => void handleDecline()}
              sx={{ flex: 1 }}
            >
              {PRIVACY_NOTICE_POPUP.actions.decline.label}
            </Button>
            <Button
              variant="contained"
              size="large"
              disabled={
                (PRIVACY_NOTICE_POPUP.actions.agree.required_for_consent && !hasAgreed) ||
                isSubmitting
              }
              onClick={() => void handleAccept()}
              sx={{ flex: 1 }}
            >
              {isSubmitting ? 'Saving…' : PRIVACY_NOTICE_POPUP.actions.agree.label}
            </Button>
          </Stack>
        </Card>
      </PageContainer>
    </AppTheme>
  );
}
