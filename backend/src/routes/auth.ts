import { Router } from 'express';
import type { Request, Response } from 'express';
import passport from 'passport';
import type { Profile } from 'passport';
import type { User } from '@shared/types';
import { hasAcceptedPrivacyConsent } from '@shared/privacyPolicy';
import { CURRENT_PRIVACY_POLICY_VERSION } from '@shared/privacyPolicy';
import { env } from '../config/env';
import { prisma } from '@lib/prisma';
import { serializeSessionUser } from '@lib/serializeSessionUser';
import {
  buildConsentDataFromPending,
  clearPendingPrivacyConsent,
  getPendingPrivacyConsent,
  setPendingPrivacyConsent,
} from '@lib/pendingPrivacyConsent';

const router = Router();

function buildPrivacyConsentRedirect(returnTo: string): string {
  return `${env.FRONTEND_URL}/privacy-consent?returnTo=${encodeURIComponent(returnTo)}`;
}

router.get('/google', (req: Request, res: Response, next) => {
  const token = req.query.token as string | undefined;
  const returnTo = token ? `/sign-in?token=${encodeURIComponent(token)}` : '/sign-in';

  if (!getPendingPrivacyConsent(req.session)) {
    return res.redirect(buildPrivacyConsentRedirect(returnTo));
  }

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: token,
  })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google/failure', session: true }),
  async (req: Request, res: Response) => {
    try {
      const request = req as Request & {
        user?: User;
        logIn: (user: unknown, done: (err: unknown) => void) => void;
      };

      const token = req.query.state as string | undefined;
      let user = request.user;

      const pending = getPendingPrivacyConsent(req.session);
      if (user && pending) {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: buildConsentDataFromPending(pending),
          include: { userCourseBins: true },
        });
        clearPendingPrivacyConsent(req.session);
        user = updatedUser;

        await new Promise<void>((resolve, reject) => {
          request.logIn(updatedUser, (err: unknown) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        });
      }

      if (user && !hasAcceptedPrivacyConsent(user)) {
        const returnTo = token
          ? `/accept-invite?token=${encodeURIComponent(token)}`
          : '/rubrics/assigned';
        return res.redirect(buildPrivacyConsentRedirect(returnTo));
      }

      if (token) {
        return res.redirect(`${env.FRONTEND_URL}/accept-invite?token=${token}`);
      }

      return res.redirect(`${env.FRONTEND_URL}/rubrics/assigned`);
    } catch {
      return res.redirect(`${env.FRONTEND_URL}/sign-in?auth=error`);
    }
  }
);

router.get('/google/failure', (_req, res) => {
  res.redirect(`${env.FRONTEND_URL}/sign-in?auth=error`);
});

router.get('/privacy-consent/pending', (req: Request, res: Response) => {
  res.json({ hasPendingConsent: Boolean(getPendingPrivacyConsent(req.session)) });
});

router.post('/privacy-consent/pending', (req: Request, res: Response) => {
  setPendingPrivacyConsent(req.session);
  req.session.save((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to save privacy consent' });
      return;
    }
    res.json({ hasPendingConsent: true });
  });
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
    include: { userCourseBins: true },
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
      include: { userCourseBins: true },
    });

    clearPendingPrivacyConsent(req.session);

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
