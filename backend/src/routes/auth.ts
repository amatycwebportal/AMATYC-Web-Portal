import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import type { Profile } from 'passport';
import type { User } from '@shared/types';
import { hasAcceptedPrivacyConsent } from '@shared/privacyPolicy';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';
import { env } from '../config/env';
import { prisma } from '@lib/prisma';
import { serializeSessionUser } from '@lib/serializeSessionUser';
import { clearPendingSignIn, getPendingSignIn, setPendingSignIn } from '@lib/pendingSignIn';
import {
  buildGoogleCallbackPath,
  completeConsentedSignIn,
  findRecognizedSignInUser,
  type GoogleSignInIdentity,
} from '@lib/resolveUnrecognizedSignIn';

const router = Router();

const PRIVACY_CONSENT_PATH = '/privacy-consent';
const SIGN_IN_ERROR_PATH = '/sign-in?auth=error';

type SessionRequest = Request & {
  user?: User;
  logIn: (user: unknown, done: (err: unknown) => void) => void;
  logout: (done: (err: unknown) => void) => void;
};

function executeLogIn(req: Request, user: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    (req as SessionRequest).logIn(user, (err: unknown) => (err ? reject(err) : resolve()));
  });
}

function executeLogout(req: Request): Promise<void> {
  if (!req.user) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    (req as SessionRequest).logout((err: unknown) => (err ? reject(err) : resolve()));
  });
}

function executeSaveSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

const readInviteToken = (req: Request): string | undefined =>
  typeof req.query.state === 'string' && req.query.state ? req.query.state : undefined;

async function handleGoogleIdentity(params: {
  req: Request;
  res: Response;
  identity: GoogleSignInIdentity;
}): Promise<void> {
  const { req, res, identity } = params;
  const inviteToken = readInviteToken(req);
  const recognizedUser = await findRecognizedSignInUser(identity);

  if (recognizedUser && hasAcceptedPrivacyConsent(recognizedUser)) {
    await executeLogIn(req, recognizedUser);
    const destinationPath = await buildGoogleCallbackPath({
      token: inviteToken,
      email: recognizedUser.email,
    });
    res.redirect(`${env.FRONTEND_URL}${destinationPath}`);
    return;
  }

  await executeLogout(req);
  setPendingSignIn(req.session, { identity, ...(inviteToken ? { inviteToken } : {}) });
  await executeSaveSession(req);
  res.redirect(`${env.FRONTEND_URL}${PRIVACY_CONSENT_PATH}`);
}

router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string | undefined;
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: token,
  })(req, res, next);
});

// Signing in only identifies the person. New accounts, outdated consent, and invitations
// wait for Privacy consent (see docs/adr/0001-account-created-only-after-privacy-consent.md).
router.get('/google/callback', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'google',
    { session: false },
    (err: unknown, identity: GoogleSignInIdentity | false | undefined) => {
      if (err || !identity) {
        res.redirect(`${env.FRONTEND_URL}${SIGN_IN_ERROR_PATH}`);
        return;
      }
      handleGoogleIdentity({ req, res, identity }).catch((error: unknown) => {
        console.error('Google sign-in failed', error);
        res.redirect(`${env.FRONTEND_URL}${SIGN_IN_ERROR_PATH}`);
      });
    }
  )(req, res, next);
});

router.get('/google/failure', (_req, res) => {
  res.redirect(`${env.FRONTEND_URL}${SIGN_IN_ERROR_PATH}`);
});

router.get('/privacy-consent/pending', (req: Request, res: Response) => {
  const pendingSignIn = getPendingSignIn(req.session);
  res.json({
    hasPendingSignIn: Boolean(pendingSignIn),
    email: pendingSignIn?.identity.email ?? null,
    name: pendingSignIn?.identity.name ?? null,
  });
});

router.post('/privacy-consent/pending', async (req: Request, res: Response) => {
  const pendingSignIn = getPendingSignIn(req.session);
  if (!pendingSignIn) {
    res.status(400).json({ error: 'No sign-in is waiting for privacy consent' });
    return;
  }

  try {
    const user = await completeConsentedSignIn(pendingSignIn.identity);
    clearPendingSignIn(req.session);
    await executeLogIn(req, user);
    const redirectPath = await buildGoogleCallbackPath({
      token: pendingSignIn.inviteToken,
      email: user.email,
    });
    res.json({ user: serializeSessionUser(user), redirectPath });
  } catch (error) {
    console.error('Failed to complete sign-in after privacy consent', error);
    res.status(500).json({ error: 'Failed to record privacy consent' });
  }
});

router.post('/privacy-consent/decline', async (req: Request, res: Response) => {
  try {
    clearPendingSignIn(req.session);
    await executeLogout(req);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Failed to sign out' });
  }
});

/** Test-only session bootstrap for Vitest integration tests (see ALLOW_TEST_LOGIN in backend __tests__/setup). */
router.get('/test-login/:userId', async (req: Request, res: Response): Promise<void> => {
  if (process.env.ALLOW_TEST_LOGIN !== '1') {
    res.status(404).end();
    return;
  }
  const rawUserId = req.params.userId;
  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const request = req as Request & {
    logIn: (u: unknown, done: (err: unknown) => void) => void;
  };
  request.logIn(user, (err: unknown) => {
    if (err) {
      res.status(500).json({ error: 'Failed to start session' });
      return;
    }
    res.json({ status: 'ok' });
  });
});

router.get('/user', (req: Request, res: Response) => {
  const request = req as Request & { user?: User };
  if (!request.user) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json({
    authenticated: true,
    user: serializeSessionUser(request.user),
  });
});

router.post('/privacy-consent', async (req: Request, res: Response) => {
  const request = req as Request & {
    user?: User;
    logIn: (user: unknown, done: (err: unknown) => void) => void;
  };

  if (!request.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const updated = await prisma.user.update({
      where: { id: request.user.id },
      data: {
        privacyConsentAcceptedAt: new Date(),
        privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
      },
    });

    request.logIn(updated, (err: unknown) => {
      if (err) {
        res.status(500).json({ error: 'Failed to refresh session' });
        return;
      }
      res.json({
        user: serializeSessionUser(updated),
      });
    });
  } catch {
    res.status(500).json({ error: 'Failed to record privacy consent' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  const request = req as Request & {
    logout: (done: (err: unknown) => void) => void;
    user?: Profile;
  };
  if (!request.user) {
    res.status(204).end();
    return;
  }
  request.logout((err) => {
    if (err) {
      res.status(500).json({ message: 'Failed to log out.' });
      return;
    }
    res.status(204).end();
  });
});

export default router;
