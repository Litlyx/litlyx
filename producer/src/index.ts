import { requireEnv } from "../../shared/utilts/requireEnv";
import { RedisStreamService } from "@services/RedisStreamService";

import crypto from 'crypto';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const allowAnyType = () => true;
const jsonOptions = { limit: '5mb', type: allowAnyType }

const streamName = requireEnv('STREAM_NAME');


function getIPFromRequest(req: express.Request) {
    const ip = req.header('X-Real-IP') || req.header('X-Forwarded-For') || '0.0.0.0';
    return ip;
}


export function createSessionHash(website: string, ip: string, userAgent: string) {
    const dailySalt = new Date().toLocaleDateString('it-IT');
    const sessionClean = dailySalt + website + ip + userAgent;
    const sessionHash = crypto.createHash('md5').update(sessionClean).digest("hex");
    return sessionHash;
}

app.post('/event', express.json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        await RedisStreamService.addToStream(streamName, { ...req.body, _type: 'event', sessionHash, ip });
        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

app.post('/visit', express.json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        await RedisStreamService.addToStream(streamName, { ...req.body, _type: 'visit', sessionHash, ip });
        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

app.post('/keep_alive', express.json(jsonOptions), async (req, res) => {
    try {
        const ip = getIPFromRequest(req);
        const sessionHash = createSessionHash(req.body.website, ip, req.body.userAgent);
        await RedisStreamService.addToStream(streamName, { ...req.body, _type: 'keep_alive', sessionHash, ip });
        return res.sendStatus(200);
    } catch (ex: any) {
        return res.status(500).json({ error: ex.message });
    }
});

async function main() {
    await RedisStreamService.connect();
    app.listen(requireEnv("PORT"), () => console.log(`Listening on port ${requireEnv("PORT")}`));
}

main();

