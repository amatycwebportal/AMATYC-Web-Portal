import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Link, Stack, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../../theme/AppTheme';
import ColorModeSelect from '../../../theme/ColorModeSelect';
import logo from '../../../assets/TPSE-logo.png';
import { hasAcceptedPrivacyConsent } from '@shared/privacyPolicy';

const REDIRECT_FALLBACK_DELAY_MS = 10_000;
const HOME_PATH = '/';
const PROFILE_PATH = '/profile';
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;

const MISSING_TOKEN_MESSAGE = 'This invitation link is missing a token.';
const MISSING_BACKEND_MESSAGE = 'The invitation service is unavailable.';
const NETWORK_ERROR_MESSAGE = 'We could not reach the server. Check your connection and try again.';
const INVITE_NOT_FOUND_MESSAGE = 'This invitation could not be found.';
const INVITE_EXPIRED_MESSAGE = 'This invitation is invalid or has expired.';
const INVITE_FAILED_MESSAGE =
  'Something went wrong while accepting this invitation. Please try again.';

interface ConsentUser {
  privacyConsentAcceptedAt?: string | null;
  privacyPolicyVersion?: string | null;
}

type AcceptInviteResult = { kind: 'navigate'; path: string } | { kind: 'error'; message: string };

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
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

const PageContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100dvh',
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

function buildReturnPath(path: string, token: string): string {
  return `${path}?token=${encodeURIComponent(token)}`;
}

function buildPrivacyConsentPath(returnTo: string): string {
  return `/privacy-consent?returnTo=${encodeURIComponent(returnTo)}`;
}

function createNavigateResult(path: string): AcceptInviteResult {
  return { kind: 'navigate', path };
}

function createErrorResult(message: string): AcceptInviteResult {
  return { kind: 'error', message };
}

function getInitialErrorMessage(
  token: string | null,
  backendUrl: string | undefined
): string | null {
  if (!token) return MISSING_TOKEN_MESSAGE;
  if (!backendUrl) return MISSING_BACKEND_MESSAGE;
  return null;
}

function getAcceptErrorResult(status: number, token: string): AcceptInviteResult {
  const signInPath = buildReturnPath('/sign-in', token);
  const acceptInvitePath = buildReturnPath('/accept-invite', token);

  if (status === HTTP_UNAUTHORIZED) {
    return createNavigateResult(buildPrivacyConsentPath(signInPath));
  }
  if (status === HTTP_FORBIDDEN) {
    return createNavigateResult(buildPrivacyConsentPath(acceptInvitePath));
  }
  if (status === HTTP_CONFLICT) {
    return createNavigateResult(PROFILE_PATH);
  }
  if (status === HTTP_NOT_FOUND) {
    return createErrorResult(INVITE_NOT_FOUND_MESSAGE);
  }
  if (status === HTTP_BAD_REQUEST) {
    return createErrorResult(INVITE_EXPIRED_MESSAGE);
  }
  return createErrorResult(INVITE_FAILED_MESSAGE);
}

async function fetchAuthUser(backendUrl: string): Promise<Response> {
  return fetch(`${backendUrl}/auth/user`, { credentials: 'include' });
}

async function fetchAcceptInvite(backendUrl: string, token: string): Promise<Response> {
  return fetch(`${backendUrl}/invitations/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token }),
  });
}

async function readConsentUser(response: Response): Promise<ConsentUser | null> {
  const authData = (await response.json()) as { user?: ConsentUser };
  return authData.user ?? null;
}

async function resolveAuthenticatedAccept(input: {
  token: string;
  backendUrl: string;
  user: ConsentUser | null;
}): Promise<AcceptInviteResult> {
  const acceptInvitePath = buildReturnPath('/accept-invite', input.token);
  if (!input.user || !hasAcceptedPrivacyConsent(input.user)) {
    return createNavigateResult(buildPrivacyConsentPath(acceptInvitePath));
  }

  try {
    const acceptResponse = await fetchAcceptInvite(input.backendUrl, input.token);
    if (acceptResponse.ok) {
      return createNavigateResult(PROFILE_PATH);
    }
    console.error('Failed to accept invite', acceptResponse.status);
    return getAcceptErrorResult(acceptResponse.status, input.token);
  } catch (error) {
    console.error('Failed to accept invite', error);
    return createErrorResult(NETWORK_ERROR_MESSAGE);
  }
}

async function resolveAcceptInviteResult(input: {
  token: string;
  backendUrl: string;
}): Promise<AcceptInviteResult> {
  const signInPath = buildReturnPath('/sign-in', input.token);

  let authResponse: Response;
  try {
    authResponse = await fetchAuthUser(input.backendUrl);
  } catch (error) {
    console.error('Failed to check authentication before accepting invite', error);
    return createErrorResult(NETWORK_ERROR_MESSAGE);
  }

  if (authResponse.status === HTTP_UNAUTHORIZED) {
    return createNavigateResult(buildPrivacyConsentPath(signInPath));
  }
  if (!authResponse.ok) {
    return createErrorResult(INVITE_FAILED_MESSAGE);
  }

  try {
    const user = await readConsentUser(authResponse);
    return resolveAuthenticatedAccept({ ...input, user });
  } catch (error) {
    console.error('Failed to read authentication response', error);
    return createErrorResult(INVITE_FAILED_MESSAGE);
  }
}

function applyAcceptInviteResult(input: {
  result: AcceptInviteResult;
  isPageActive: boolean;
  navigate: NavigateFunction;
  setErrorMessage: (message: string) => void;
}): void {
  if (!input.isPageActive) return;
  if (input.result.kind === 'navigate') {
    input.navigate(input.result.path, { replace: true });
    return;
  }
  input.setErrorMessage(input.result.message);
}

function HomeFallbackLink() {
  return (
    <Typography>
      If you aren&apos;t redirected,{' '}
      <Link component={RouterLink} to={HOME_PATH} replace>
        click here
      </Link>{' '}
      to go to the home page.
    </Typography>
  );
}

function AcceptInviteWaiting({ showHomeFallback }: { showHomeFallback: boolean }) {
  return (
    <Stack spacing={2} alignItems="center">
      <CircularProgress aria-label="Accepting invite" />
      <Typography variant="h5" component="h1">
        Accepting invite
      </Typography>
      <Typography color="text.secondary">
        Please wait while we finish setting up your account.
      </Typography>
      {showHomeFallback ? <HomeFallbackLink /> : null}
    </Stack>
  );
}

function AcceptInviteError({ message }: { message: string }) {
  const navigate = useNavigate();

  const executeGoHome = () => {
    navigate(HOME_PATH, { replace: true });
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h5" component="h1">
        Unable to accept invite
      </Typography>
      <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
        {message}
      </Alert>
      <Button variant="contained" onClick={executeGoHome}>
        Go to home page
      </Button>
    </Stack>
  );
}

function AcceptInviteCard({
  errorMessage,
  showHomeFallback,
}: {
  errorMessage: string | null;
  showHomeFallback: boolean;
}) {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <PageContainer direction="column" justifyContent="center" alignItems="center">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Box component="img" src={logo} alt="TPSE Logo" sx={{ width: 220, height: 'auto' }} />
          {errorMessage ? (
            <AcceptInviteError message={errorMessage} />
          ) : (
            <AcceptInviteWaiting showHomeFallback={showHomeFallback} />
          )}
        </Card>
      </PageContainer>
    </AppTheme>
  );
}

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const hasStartedAcceptRef = useRef(false);
  const isPageActiveRef = useRef(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(() =>
    getInitialErrorMessage(token, backendUrl)
  );
  const [showHomeFallback, setShowHomeFallback] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowHomeFallback(true);
    }, REDIRECT_FALLBACK_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    isPageActiveRef.current = true;
    const stop = () => {
      isPageActiveRef.current = false;
    };

    if (!token || !backendUrl || hasStartedAcceptRef.current) {
      return stop;
    }
    hasStartedAcceptRef.current = true;

    void resolveAcceptInviteResult({ token, backendUrl }).then((result) => {
      applyAcceptInviteResult({
        result,
        isPageActive: isPageActiveRef.current,
        navigate,
        setErrorMessage,
      });
    });

    return stop;
  }, [backendUrl, navigate, token]);

  return <AcceptInviteCard errorMessage={errorMessage} showHomeFallback={showHomeFallback} />;
}
