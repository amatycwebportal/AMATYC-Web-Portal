import { Router } from 'express';
import type { Request, Response } from 'express';
import passport from 'passport';
import type { Profile } from 'passport';
import type { User, UserRole } from '@shared/types';
import { env } from '../config/env';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/failure', session: true }),
  (_req, res) => res.redirect(`${env.FRONTEND_URL}/profile`)
);

router.get('/google/failure', (_req, res) => {
  res.redirect(`${env.FRONTEND_URL}/sign-in?auth=error`);
});

router.get('/user', (req: Request, res: Response) => {
  const request = req as Request & { user?: User };
  if (!request.user) {
    res.status(401).json({ authenticated: false });
    return;
  }
  const { id, email, name, avatarUrl, role } = request.user;
  res.json({ authenticated: true, user: { id, email, name, avatarUrl, role: role as UserRole } });
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
