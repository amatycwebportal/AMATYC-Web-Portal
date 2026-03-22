import { prisma } from '@lib/prisma';
import { Router } from 'express';
import crypto from 'crypto';
import { sendInviteEmail } from '@lib/mailer';
const router = Router();
router.get('/', (req, res) => {
    res.json({ status: 'ok' });
});
router.post('/create', async (req, res) => {
    const { name, localLeaderName, localLeaderEmail, invitedByuser } = req.body;
    if (!name || !localLeaderName || !localLeaderEmail || !invitedByuser) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        //Check if institution already exists
        const institution_check = await prisma.institution.findUnique({
            where: { name },
        });
        if (institution_check) {
            return res.status(409).json({ error: 'Institution already exists' });
        }
        //Create institution
        const institution = await prisma.institution.create({
            data: { name },
        });
        if (!institution) {
            return res.status(500).json({ error: 'Failed to create institution' });
        }
        //Check if user already exists
        const user = await prisma.user.findUnique({
            where: { email: localLeaderEmail },
        });
        if (user) {
            return res.status(409).json({ error: 'User already exists' });
        }
        //Create invitation
        const invitation = await prisma.invitation.create({
            data: {
                email: localLeaderEmail,
                institutionId: institution.id,
                role: 'LOCAL_LEADER',
                token: crypto.randomBytes(32).toString('hex'),
                invitedByUser: {
                    connect: {
                        id: invitedByuser.id,
                    },
                },
            },
        });
        //invite email local leader to site call
        await sendInviteEmail(localLeaderEmail, invitation.token);
        res.json({ status: 'ok' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=institutions.js.map