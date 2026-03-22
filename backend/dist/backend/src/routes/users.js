import { prisma } from '@lib/prisma';
import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => {
    res.json({ status: 'ok' });
});
router.get('/all', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                userCourseBins: true,
            },
            orderBy: { name: 'asc' },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
export default router;
//# sourceMappingURL=users.js.map