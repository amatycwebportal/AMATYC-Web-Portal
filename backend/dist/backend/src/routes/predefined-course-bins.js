import { prisma } from '@lib/prisma';
import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => {
    res.json({ status: 'ok' });
});
router.get('/all', async (req, res) => {
    try {
        const predefinedCourseBins = await prisma.predefinedCourseBin.findMany({
            orderBy: { binName: 'asc' },
        });
        res.json(predefinedCourseBins);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch predefined course bins', details: error });
    }
});
router.post('/create', async (req, res) => {
    try {
        const { name } = req.body;
        const predefinedCourseBin = await prisma.predefinedCourseBin.create({
            data: { binName: name },
        });
        res.json(predefinedCourseBin);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create predefined course bin', details: error });
    }
});
export default router;
//# sourceMappingURL=predefined-course-bins.js.map