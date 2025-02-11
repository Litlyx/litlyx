
import { Router } from 'express';
import { RedisStreamService } from './shared/services/RedisStreamService';
import { requireEnv } from './shared/utils/requireEnv';

const stream_name = requireEnv('STREAM_NAME');

export const metricsRouter = Router();

metricsRouter.get('/queue', async (req, res) => {
    try {
        const size = await RedisStreamService.getQueueInfo(stream_name);
        res.json({ size });
    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: ex.message });
    }
})

metricsRouter.get('/durations', async (req, res) => {
    try {
        const durations = RedisStreamService.METRICS_get()
        res.json({ durations });
    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: ex.message });
    }
})