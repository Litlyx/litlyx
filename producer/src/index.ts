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
app.use('/v1', DeprecatedRouter);

app.post('/event', express.json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        const flowHash = createFlowSessionHash(req.body.pid, ip, req.body.userAgent);
        await RedisStreamService.addToStream(streamName, {
            ...req.body, _type: 'event', sessionHash, ip, flowHash
        });
        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

app.post('/visit', express.json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        const flowHash = createFlowSessionHash(req.body.pid, ip, req.body.userAgent);
        await RedisStreamService.addToStream(streamName, { ...req.body, _type: 'visit', sessionHash, ip, flowHash });
        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

app.post('/keep_alive', express.json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        const flowHash = createFlowSessionHash(req.body.pid, ip, req.body.userAgent);
        await RedisStreamService.addToStream(streamName, {
            ...req.body, _type: 'keep_alive', sessionHash, ip,
            instant: req.body.instant + '',
            flowHash
        });
        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

async function main() {
    const PORT = requireEnv("PORT");
    await RedisStreamService.connect();
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

main();

