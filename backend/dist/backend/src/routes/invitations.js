import { prisma } from '@lib/prisma';
import { Router } from 'express';
import { env } from '@config/env';
const router = Router();
router.get('/', (req, res) => {
    res.json({ status: 'ok' });
});
router.post('/accept', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token is required' });
    }
    const userId = req.user.id;
    const invitation = await prisma.invitation.findUnique({ where: { token } });
    if (!invitation) {
        return res.status(404).json({ error: 'Invitation not found' });
    }
    if (invitation.acceptedAt) {
        return res.status(409).json({ error: 'Invitation already accepted' });
    }
    if (invitation.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Invitation expired' });
    }
    await prisma.$transaction([
        prisma.user.update({
            where: { id: userId },
            data: { institutionId: invitation.institutionId, role: invitation.role },
        }),
        prisma.invitation.update({
            where: { token },
            data: { acceptedAt: new Date() },
        }),
    ]);
    return res.json({ status: 'ok' });
});
export default router;
//# sourceMappingURL=invitations.js.map