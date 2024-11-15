
import { requireEnv } from '@utils/requireEnv';
import { connectDatabase } from '@services/DatabaseService';
import { RedisStreamService } from '@services/RedisStreamService';
import { ProjectModel } from "@schema/project/ProjectSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { EventModel } from "@schema/metrics/EventSchema";
import { lookup } from './lookup';
import { UAParser } from 'ua-parser-js';
import { checkLimits } from './LimitChecker';

import { ProjectLimitModel } from '@schema/project/ProjectsLimits';
import { ProjectCountModel } from '@schema/project/ProjectsCounts';


connectDatabase(requireEnv('MONGO_CONNECTION_STRING'));
main();

async function main() {

    await RedisStreamService.connect();

    const stream_name = requireEnv('STREAM_NAME');
    const group_name = requireEnv('GROUP_NAME') as any; // Checks are inside "startReadingLoop"

    await RedisStreamService.startReadingLoop({
        stream_name, group_name, consumer_name: `CONSUMER_${process.env.NODE_APP_INSTANCE || 'DEFAULT'}`
    }, processStreamEntry);

}

async function processStreamEntry(data: Record<string, string>) {
    try {

        const start = Date.now();

        const eventType = data._type;
        if (!eventType) return;

        const { pid, sessionHash } = data;

        const project = await ProjectModel.exists({ _id: pid });
        if (!project) return;

        const canLog = await checkLimits(pid);
        if (!canLog) return;

        if (eventType === 'event') {
            await process_event(data, sessionHash);
        } else if (eventType === 'keep_alive') {
            await process_keep_alive(data, sessionHash);
        } else if (eventType === 'visit') {
            await process_visit(data, sessionHash);
        }

        const duration = Date.now() - start;

        // console.log('Entry processed in', duration, 'ms');

    } catch (ex: any) {
        console.error('ERROR PROCESSING STREAM EVENT', ex.message);
    }
}

async function process_visit(data: Record<string, string>, sessionHash: string) {

    const { pid, ip, website, page, referrer, userAgent, flowHash } = data;

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
        }),
        ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'visits': 1 } }, { upsert: true }),
        ProjectLimitModel.updateOne({ project_id: pid }, { $inc: { 'visits': 1 } })
    ]);

}

async function process_keep_alive(data: Record<string, string>, sessionHash: string) {

    const { pid, instant, flowHash } = data;

    const existingSession = await SessionModel.findOne({ project_id: pid, session: sessionHash }, { _id: 1 });
    if (!existingSession) {
        await ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'sessions': 1 } }, { upsert: true });
    }

    if (instant == "true") {
        await SessionModel.updateOne({ project_id: pid, session: sessionHash, }, {
            $inc: { duration: 0 },
            flowHash,
            updated_at: Date.now()
        }, { upsert: true });
    } else {
        await SessionModel.updateOne({ project_id: pid, session: sessionHash, }, {
            $inc: { duration: 1 },
            flowHash,
            updated_at: Date.now()
        }, { upsert: true });
    }

}

async function process_event(data: Record<string, string>, sessionHash: string) {

    const { name, metadata, pid, flowHash } = data;

    let metadataObject;
    try {
        if (metadata) metadataObject = JSON.parse(metadata);
    } catch (ex) {
        metadataObject = { error: 'Error parsing metadata' }
    }

    await Promise.all([
        EventModel.create({ project_id: pid, name, flowHash, metadata: metadataObject, session: sessionHash }),
        ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'events': 1 } }, { upsert: true }),
        ProjectLimitModel.updateOne({ project_id: pid }, { $inc: { 'events': 1 } })
    ]);


}