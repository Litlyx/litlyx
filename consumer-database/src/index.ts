
import { requireEnv } from '@utils/requireEnv';
import { connectDatabase } from '@services/DatabaseService';
import { RedisStreamService } from '@services/RedisStreamService';
import { ProjectModel } from "@schema/ProjectSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { EventModel } from "@schema/metrics/EventSchema";
import { lookup } from './lookup';
import { UAParser } from 'ua-parser-js';

connectDatabase(requireEnv('MONGO_CONNECTION_STRING'));
main();

async function main() {

    await RedisStreamService.connect();

    const stream_name = requireEnv('STREAM_NAME');
    const group_name = requireEnv('GROUP_NAME') as any; // Checks are inside "startReadingLoop"

    await RedisStreamService.startReadingLoop({
        stream_name, group_name, consumer_name: `CONSUMER_${process.env.NODE_APP_INSTANCE}`
    }, processStreamEntry);

}

async function processStreamEntry(data: Record<string, string>) {
    try {
        const eventType = data._type;
        if (!eventType) return;

        const { pid, sessionHash } = data;

        const project = await ProjectModel.exists({ _id: pid });
        if (!project) return;


        if (eventType === 'event') return await process_event(data, sessionHash);
        if (eventType === 'keep_alive') return await process_keep_alive(data, sessionHash);
        if (eventType === 'visit') return await process_visit(data, sessionHash);

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

    await VisitModel.create({
        project_id: pid, website, page, referrer: referrerParsed.hostname,
        browser: userAgentParsed.browser.name || 'NO_BROWSER',
        os: userAgentParsed.os.name || 'NO_OS',
        device: device ? device : (userAgentParsed.browser.name ? 'desktop' : undefined),
        session: sessionHash,
        flowHash,
        continent: geoLocation[0],
        country: geoLocation[1],
    });

}

async function process_keep_alive(data: Record<string, string>, sessionHash: string) {

    const { pid, instant, flowHash } = data;

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

    const event = new EventModel({ project_id: pid, name, flowHash, metadata: metadataObject, session: sessionHash });
    await event.save();

}