import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env';
const router = Router();
router.get('/google', (req, res, next) => {
    const token = req.query.token;
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: token,
    })(req, res, next);
});
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google/failure', session: true }), (req, res) => {
    console.log('callback hit, user:', req.user);
    console.log('state:', req.query.state);
    const token = req.query.state;
    if (token) {
        return res.redirect(`${env.FRONTEND_URL}/accept-invite?token=${token}`);
    }
    return res.redirect(`${env.FRONTEND_URL}/profile`);
});
router.get('/google/failure', (_req, res) => {
    console.log('failure hit');
    res.redirect(`${env.FRONTEND_URL}/sign-in?auth=error`);
});
router.get('/user', (req, res) => {
    const request = req;
    if (!request.user) {
        res.status(401).json({ authenticated: false });
        return;
    }
    const { id, email, name, avatarUrl, role, institutionId } = request.user;
    res.json({
        authenticated: true,
        user: { id, email, name, avatarUrl, role: role, institutionId },
    });
});
router.post('/logout', (req, res) => {
    const request = req;
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
//# sourceMappingURL=auth.js.map