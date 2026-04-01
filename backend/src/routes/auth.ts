import { Router } from 'express';
import type { Request, Response } from 'express';
import passport from 'passport';
import type { Profile } from 'passport';
import type { User, UserRole } from '@shared/types';
import { env } from '../config/env';
import { prisma } from '@lib/prisma';
const router = Router();

router.get('/google', (req: Request, res: Response, next) => {
  const token = req.query.token as string | undefined;
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: token,
  })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google/failure', session: true }),
  (req: Request, res: Response) => {
    console.log('callback hit, user:', req.user);
    console.log('state:', req.query.state);
    const token = req.query.state as string | undefined;
    if (token) {
      return res.redirect(`${env.FRONTEND_URL}/accept-invite?token=${token}`);
    }
    return res.redirect(`${env.FRONTEND_URL}/profile`);
  }
);

router.get('/google/failure', (_req, res) => {
  console.log('failure hit');
  res.redirect(`${env.FRONTEND_URL}/sign-in?auth=error`);
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
  const { id, email, name, avatarUrl, role, institutionId, userCourseBins } = request.user;
  res.json({
    authenticated: true,
    user: { id, email, name, avatarUrl, role: role as UserRole, institutionId, userCourseBins },
  });
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
