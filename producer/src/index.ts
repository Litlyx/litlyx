import { requireEnv } from "./shared/utils/requireEnv";
import { RedisStreamService } from "./shared/services/RedisStreamService";

import express from 'express';
import cors from 'cors';
import { createFlowSessionHash, createSessionHash, getIPFromRequest } from "./utils";

const app = express();
app.use(cors());

const allowAnyType = () => true;
const jsonOptions = { limit: '25kb', type: allowAnyType }

const streamName = requireEnv('STREAM_NAME');

import DeprecatedRouter from "./deprecated";
import { isAllowedToLog } from "./controller";
import { connectDatabase } from "./shared/services/DatabaseService";

app.use('/v1', DeprecatedRouter);

app.post('/event', express.json(jsonOptions), async (req, res) => {
    try {

        const startTime = Date.now();

        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        const flowHash = createFlowSessionHash(req.body.pid, ip, req.body.userAgent);

        const allowed = await isAllowedToLog(req.body.pid, req.body.website, ip, req.body.userAgent);
        if (!allowed) return res.sendStatus(400);

        await RedisStreamService.addToStream(streamName, {
            ...req.body, _type: 'event', sessionHash, ip, flowHash,
            timestamp: Date.now()
        });

        const duration = Date.now() - startTime;

        await RedisStreamService.METRICS_PRODUCER_onProcess(process.env.NODE_APP_INSTANCE, duration);

        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

app.post('/visit', express.json(jsonOptions), async (req, res) => {
    try {

        const startTime = Date.now();

        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        const flowHash = createFlowSessionHash(req.body.pid, ip, req.body.userAgent);

        const allowed = await isAllowedToLog(req.body.pid, req.body.website, ip, req.body.userAgent);
        if (!allowed) return res.sendStatus(400);

        await RedisStreamService.addToStream(streamName, { ...req.body, _type: 'visit', sessionHash, ip, flowHash, timestamp: Date.now() });

        const duration = Date.now() - startTime;

        await RedisStreamService.METRICS_PRODUCER_onProcess(process.env.NODE_APP_INSTANCE, duration);

        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

app.post('/keep_alive', express.json(jsonOptions), async (req, res) => {
    try {

        const startTime = Date.now();

        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        const flowHash = createFlowSessionHash(req.body.pid, ip, req.body.userAgent);

        const allowed = await isAllowedToLog(req.body.pid, req.body.website, ip, req.body.userAgent);
        if (!allowed) return res.sendStatus(400);

        await RedisStreamService.addToStream(streamName, {
            ...req.body, _type: 'keep_alive', sessionHash, ip,
            instant: req.body.instant + '',
            flowHash, timestamp: Date.now()
        });

        const duration = Date.now() - startTime;

        await RedisStreamService.METRICS_PRODUCER_onProcess(process.env.NODE_APP_INSTANCE, duration);

        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

async function main() {
    const PORT = requireEnv("PORT");
    await connectDatabase(process.env.MONGO_CONNECTION_STRING);
    await RedisStreamService.connect();
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

main();

