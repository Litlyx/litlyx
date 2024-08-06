import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { COUNTS_EXPIRE_TIME, COUNTS_SESSIONS_EXPIRE_TIME, Redis } from "~/server/services/CacheService";
import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";

export type MetricsCounts = {
    eventsCount: number,
    visitsCount: number,
    sessionsVisitsCount: number,
    firstEventDate: number,
    firstViewDate: number,
    avgSessionDuration: number
}

export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;


    return await Redis.useCache({
        key: `counts:${project_id}`,
        exp: COUNTS_EXPIRE_TIME
    }, async () => {


        const count: { events: number, visits: number }[] = await ProjectCountModel.aggregate([
            { $match: { project_id: project._id } },
            {
                $group: {
                    _id: "$project_id",
                    events: { $sum: "$events" },
                    visits: { $sum: "$visits" },
                    sessions: { $sum: "$sessions" },
                }
            }
        ]);

        const sessionsVisitsCount: any[] = await Redis.useCache({
            key: `counts:${project_id}:sessions_count`,
            exp: COUNTS_SESSIONS_EXPIRE_TIME
        }, async () => {
            return await SessionModel.aggregate([
                { $match: { project_id: project._id } },
                { $group: { _id: "$session", time: { $sum: '$duration' }, count: { $sum: 1 } } },
            ])
        });

        const totalSessions = sessionsVisitsCount.length;
        const totalSessionsTime = sessionsVisitsCount.reduce((a, e) => a + e.time, 0);
        const avgSessionDuration = totalSessionsTime / totalSessions;

        const firstEvent = await EventModel.findOne({ project_id: project._id }, { created_at: 1 });
        const firstView = await VisitModel.findOne({ project_id: project._id }, { created_at: 1 });

        return {
            eventsCount: count[0].events,
            visitsCount: count[0].visits,
            sessionsVisitsCount: totalSessions || 0,
            avgSessionDuration,
            firstEventDate: firstEvent?.created_at.getTime()  || Date.now(),
            firstViewDate: firstView?.created_at.getTime() || Date.now(),
        } as MetricsCounts;

    });




});