
import { Router } from "express";

const router = Router();

router.get('/', async (req, res) => {
    try {
        return res.json({ alive: true });
    } catch (ex) {
        console.error(ex);
        return res.status(500).json({ error: 'ERROR' });
    }
});

export default router;