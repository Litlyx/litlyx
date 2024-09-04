
import { RedisStreamService } from '@services/RedisStreamService';
import { requireEnv } from '../../shared/utilts/requireEnv';
import { EventModel } from '@schema/metrics/EventSchema';
import { SessionModel } from '@schema/metrics/SessionSchema';
import { ProjectModel } from '@schema/ProjectSchema';
import { ProjectLimitModel } from '@schema/ProjectsLimits';
import { ProjectCountModel } from '@schema/ProjectsCounts';
import { EVENT_LOG_LIMIT_PERCENT } from '@data/broker/Limits';
import { checkLimitsForEmail } from './Controller';
import { lookup } from './lookup';
import { UAParser } from 'ua-parser-js';
import { VisitModel } from '@schema/metrics/VisitSchema';


export async function startStreamLoop() {

    await RedisStreamService.connect();

    await RedisStreamService.startReadingLoop({
        streamName: requireEnv('STREAM_NAME'),
        delay: { base: 10, empty: 5000 },
        readBlock: 2000
    }, processStreamEvent);

}


export async function processStreamEvent(data: Record<string, string>) {
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



async function checkLimits(project_id: string) {
    const projectLimits = await ProjectLimitModel.findOne({ project_id });
    if (!projectLimits) return false;
    const TOTAL_COUNT = projectLimits.events + projectLimits.visits;
    const COUNT_LIMIT = projectLimits.limit;
    if ((TOTAL_COUNT) > COUNT_LIMIT * EVENT_LOG_LIMIT_PERCENT) return false;
    await checkLimitsForEmail(projectLimits);
    return true;
}

async function process_visit(data: Record<string, string>, sessionHash: string) {

    const { pid, ip, website, page, referrer, userAgent, flowHash } = data;

    const canLog = await checkLimits(pid);
    if (!canLog) return;

    let referrerParsed;
    try {
        referrerParsed = new URL(referrer);
    } catch (ex) {
        referrerParsed = { hostname: referrer };
    }

    const geoLocation = lookup(ip);

    const userAgentParsed = UAParser(userAgent);

    const device = userAgentParsed.device.type;

    const visit = new VisitModel({
        project_id: pid, website, page, referrer: referrerParsed.hostname,
        browser: userAgentParsed.browser.name || 'NO_BROWSER',
        os: userAgentParsed.os.name || 'NO_OS',
        device: device ? device : (userAgentParsed.browser.name ? 'desktop' : undefined),
        session: sessionHash,
        flowHash,
        continent: geoLocation[0],
        country: geoLocation[1],
    });

    await visit.save();



    await ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'visits': 1 } }, { upsert: true });
    await ProjectLimitModel.updateOne({ project_id: pid }, { $inc: { 'visits': 1 } });

}

async function process_keep_alive(data: Record<string, string>, sessionHash: string) {

    const { pid, instant, flowHash } = data;

    const canLog = await checkLimits(pid);
    if (!canLog) return;

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

    const canLog = await checkLimits(pid);
    if (!canLog) return;

    let metadataObject;
    try {
        if (metadata) metadataObject = JSON.parse(metadata);
    } catch (ex) {
        metadataObject = { error: 'Error parsing metadata' }
    }

    const event = new EventModel({ project_id: pid, name, flowHash, metadata: metadataObject, session: sessionHash });
    await event.save();

    await ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'events': 1 } }, { upsert: true });
    await ProjectLimitModel.updateOne({ project_id: pid }, { $inc: { 'events': 1 } });

}