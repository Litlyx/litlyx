import { Router, json } from "express";
import { createSessionHash, getIPFromRequest } from "./utils";
import { requireEnv } from "../../shared/utilts/requireEnv";
import { RedisStreamService } from "@services/RedisStreamService";

const router = Router();

const allowAnyType = () => true;
const jsonOptions = { limit: '5mb', type: allowAnyType }

const streamName = requireEnv('STREAM_NAME');

router.post('/keep_alive', json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        await RedisStreamService.addToStream(streamName, {
            ...req.body, _type: 'keep_alive', sessionHash, ip,
            instant: req.body.instant + ''
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
        
        const { type } = req.body;

        if (type === 0) {
            await RedisStreamService.addToStream(streamName, { ...req.body, _type: 'visit', sessionHash, ip });
        } else {
            await RedisStreamService.addToStream(streamName, { ...req.body, _type: 'event', sessionHash, ip });
        }
        
        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

export default router;