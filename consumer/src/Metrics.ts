
import { Router } from 'express';
import { RedisStreamService } from './shared/services/RedisStreamService';
import { requireEnv } from './shared/utils/requireEnv';

const stream_name = requireEnv('STREAM_NAME');

export class MetricsManager {

    private static processTime = new Map<string, number[]>();

    static onProcess(id: string, time: number) {
        const target = this.processTime.get(id);
        if (!target) {
            this.processTime.set(id, [time]);
        } else {
            target.push(time);
            if (target.length > 1000) target.splice(0, target.length - 1000);
        }
    }

    static get() {
        return Array.from(this.processTime.entries());
    }

}

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
        const durations = MetricsManager.get();
        res.json({ durations });
    } catch (ex) {
        console.error(ex);
        res.status(500).json({ error: ex.message });
    }
})