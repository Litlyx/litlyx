
import { requireEnv } from './shared/utils/requireEnv';
import { connectDatabase } from './shared/services/DatabaseService';
import { RedisStreamService } from './shared/services/RedisStreamService';
import { ProjectModel } from "./shared/schema/project/ProjectSchema";
import { VisitModel } from "./shared/schema/metrics/VisitSchema";
import { SessionModel } from "./shared/schema/metrics/SessionSchema";
import { EventModel } from "./shared/schema/metrics/EventSchema";
import { lookup } from './lookup';
import { UAParser } from 'ua-parser-js';
import { checkLimits } from './LimitChecker';
import express from 'express';

import { ProjectCountModel } from './shared/schema/project/ProjectsCounts';
import { metricsRouter } from './Metrics';
import { UserLimitModel } from './shared/schema/UserLimitSchema';

const app = express();

app.use('/metrics', metricsRouter);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));

connectDatabase(requireEnv('MONGO_CONNECTION_STRING'));
main();

const CONSUMER_NAME = `CONSUMER_${process.env.NODE_APP_INSTANCE || 'DEFAULT'}`


async function getProjectOwner(pid: string) {
    const ownerData = await ProjectModel.findOne({ _id: pid }, { owner: 1 });
    return ownerData.owner;
}

async function main() {

    await RedisStreamService.connect();

    const stream_name = requireEnv('STREAM_NAME');
    const group_name = requireEnv('GROUP_NAME') as any; // Checks are inside "startReadingLoop"

    await RedisStreamService.startReadingLoop({
        stream_name, group_name, consumer_name: CONSUMER_NAME
    }, processStreamEntry);

}

async function processStreamEntry(data: Record<string, string>) {

    const start = Date.now();

    try {

        const eventType = data._type;
        if (!eventType) return console.log('No type');

        const { pid, sessionHash } = data;

        const owner = await getProjectOwner(pid);
        if (!owner) return;

        const canLog = await checkLimits(owner.toString());
        if (!canLog) return;

        if (eventType === 'event') {
            await process_event(data, sessionHash, owner.toString());
        } else if (eventType === 'keep_alive') {
            await process_keep_alive(data, sessionHash, owner.toString());
        } else if (eventType === 'visit') {
            await process_visit(data, sessionHash, owner.toString());
        }

    } catch (ex: any) {
        console.error('ERROR PROCESSING STREAM EVENT', ex.message);
    }

    const duration = Date.now() - start;

    RedisStreamService.METRICS_onProcess(CONSUMER_NAME, duration);

}

async function process_visit(data: Record<string, string>, sessionHash: string, user_id: string) {

    const { pid, ip, website, page, referrer, userAgent, flowHash, timestamp } = data;

    let referrerParsed;
    try {
        referrerParsed = new URL(referrer);
    } catch (ex) {
        referrerParsed = { hostname: referrer };
    }

    const geoLocation = lookup(ip);

    const userAgentParsed = UAParser(userAgent);

    const device = userAgentParsed.device.type;

    await Promise.all([
        VisitModel.create({
            project_id: pid, website, page, referrer: referrerParsed.hostname,
            browser: userAgentParsed.browser.name || 'NO_BROWSER',
            os: userAgentParsed.os.name || 'NO_OS',
            device: device ? device : (userAgentParsed.browser.name ? 'desktop' : undefined),
            session: sessionHash,
            flowHash,
            continent: geoLocation[0],
            country: geoLocation[1],
            created_at: new Date(parseInt(timestamp))
        }),
        ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'visits': 1 } }, { upsert: true }),
        UserLimitModel.updateOne({ user_id }, { $inc: { 'visits': 1 } })
    ]);

}

async function process_keep_alive(data: Record<string, string>, sessionHash: string, user_id: string) {

    const { pid, instant, flowHash, timestamp, website } = data;

    const existingSession = await SessionModel.findOne({ project_id: pid, session: sessionHash }, { _id: 1 });
    if (!existingSession) {
        await ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'sessions': 1 } }, { upsert: true });
    }

    if (instant == "true") {
        await SessionModel.updateOne({ project_id: pid, session: sessionHash, }, {
            $inc: { duration: 0 },
            flowHash,
            website,
            updated_at: new Date(parseInt(timestamp))
        }, { upsert: true });
    } else {
        await SessionModel.updateOne({ project_id: pid, session: sessionHash, }, {
            $inc: { duration: 1 },
            flowHash,
            website,
            updated_at: new Date(parseInt(timestamp))
        }, { upsert: true });
    }

}

async function process_event(data: Record<string, string>, sessionHash: string, user_id: string) {

    const { name, metadata, pid, flowHash, timestamp, website } = data;

    let metadataObject;
    try {
        if (metadata) metadataObject = JSON.parse(metadata);
    } catch (ex) {
        metadataObject = { error: 'Error parsing metadata' }
    }

    await Promise.all([
        EventModel.create({
            project_id: pid, name, flowHash, metadata: metadataObject, session: sessionHash,
            website,
            created_at: new Date(parseInt(timestamp))
        }),
        ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'events': 1 } }, { upsert: true }),
        UserLimitModel.updateOne({ user_id }, { $inc: { 'events': 1 } })
    ]);


}