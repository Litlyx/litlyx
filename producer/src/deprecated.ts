import { Router, json } from "express";
import { createSessionHash, getIPFromRequest } from "./utils";
import { requireEnv } from "./shared/utils/requireEnv";
import { RedisStreamService } from "./shared/services/RedisStreamService";
import { isAllowedToLog } from "./controller";

const router = Router();

const allowAnyType = () => true;
const jsonOptions = { limit: '25kb', type: allowAnyType }

const streamName = requireEnv('STREAM_NAME');

router.post('/keep_alive', json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);

        const allowed = await isAllowedToLog(req.body.pid, req.body.website, ip, req.body.userAgent);
        if (!allowed) return res.sendStatus(400);

        await RedisStreamService.addToStream(streamName, {
            ...req.body, _type: 'keep_alive', sessionHash, ip,
            instant: req.body.instant + '',
            timestamp: Date.now()
        });
        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});



router.post('/metrics/push', json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);

        const allowed = await isAllowedToLog(req.body.pid, req.body.website, ip, req.body.userAgent);
        if (!allowed) return res.sendStatus(400);

        const { type } = req.body;

        if (type === 0) {
            await RedisStreamService.addToStream(streamName, {
                ...req.body, _type: 'visit', sessionHash, ip,
                screenWidth: '0',
                screenHeight: '0',
                type: req.body.type.toString(),
                timestamp: Date.now()
            });
        } else {
            await RedisStreamService.addToStream(streamName, {
                ...req.body, _type: 'event', sessionHash, ip,
                type: req.body.type.toString(),
                timestamp: Date.now()
            });
        }

        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

export default router;