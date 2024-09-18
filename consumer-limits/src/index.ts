
import { requireEnv } from '@utils/requireEnv';
import { connectDatabase } from '@services/DatabaseService';
import { RedisStreamService } from '@services/RedisStreamService';
import { ProjectModel } from "@schema/ProjectSchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { ProjectLimitModel } from '@schema/ProjectsLimits';
import { ProjectCountModel } from '@schema/ProjectsCounts';
import { MAX_LOG_LIMIT_PERCENT } from '@data/broker/Limits';
import { checkLimitsForEmail } from './EmailController';

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

async function checkLimits(project_id: string) {
    const projectLimits = await ProjectLimitModel.findOne({ project_id });
    if (!projectLimits) return false;
    const TOTAL_COUNT = projectLimits.events + projectLimits.visits;
    const COUNT_LIMIT = projectLimits.limit;
    if ((TOTAL_COUNT) > COUNT_LIMIT * MAX_LOG_LIMIT_PERCENT) return false;
    await checkLimitsForEmail(projectLimits);
    return true;
}


async function processStreamEntry(data: Record<string, string>) {
    try {
        const eventType = data._type;
        if (!eventType) return;

        const { pid, sessionHash } = data;

        const project = await ProjectModel.exists({ _id: pid });
        if (!project) return;

        const canLog = await checkLimits(pid);
        if (!canLog) return;

        if (eventType === 'event') return await process_event(data, sessionHash);
        if (eventType === 'keep_alive') return await process_keep_alive(data, sessionHash);
        if (eventType === 'visit') return await process_visit(data, sessionHash);

    } catch (ex: any) {
        console.error('ERROR PROCESSING STREAM EVENT', ex.message);
    }
}

async function process_visit(data: Record<string, string>, sessionHash: string) {
    const { pid } = data;
    await ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'visits': 1 } }, { upsert: true });
    await ProjectLimitModel.updateOne({ project_id: pid }, { $inc: { 'visits': 1 } });

}

async function process_keep_alive(data: Record<string, string>, sessionHash: string) {
    const { pid } = data;
    const existingSession = await SessionModel.findOne({ project_id: pid, session: sessionHash }, { _id: 1 });
    if (existingSession) return;
    await ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'sessions': 1 } }, { upsert: true });
}

async function process_event(data: Record<string, string>, sessionHash: string) {
    const { pid } = data;
    await ProjectCountModel.updateOne({ project_id: pid }, { $inc: { 'events': 1 } }, { upsert: true });
    await ProjectLimitModel.updateOne({ project_id: pid }, { $inc: { 'events': 1 } });
}