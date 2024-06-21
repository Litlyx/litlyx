import { getTimeline } from "./generic";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { SessionModel } from "@schema/metrics/SessionSchema";
import DateService from "@services/DateService";

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;


    const { slice, from, to } = await readBody(event);

    if (!from) return setResponseStatus(event, 400, 'from is required');
    if (!from) return setResponseStatus(event, 400, 'to is required');
    if (!from) return setResponseStatus(event, 400, 'slice is required');

     return await Redis.useCache({
         key: `timeline:sessions:${project_id}:${slice}:${from || 'none'}:${to || 'none'}`,
         exp: TIMELINE_EXPIRE_TIME
     }, async () => {

    const { group, sort, fromParts } = DateService.getQueryDateRange(slice);

    const aggregation = [
        {
            $match: {
                project_id: project._id,
                created_at: { $gte: new Date(from), $lte: new Date(to) },
            }
        },
        { $group: { _id: group, count: { $sum: 1 } } },
        { $sort: sort },
        { $project: { _id: { $dateFromParts: fromParts }, count: "$count" } }
    ]

    const timelineVisits: { _id: string, count: number }[] = await SessionModel.aggregate(aggregation);
    const filledDates = DateService.fillDates(timelineVisits.map(e => e._id), slice);
    const merged = DateService.mergeFilledDates(filledDates, timelineVisits, '_id', slice, { count: 0 });
    return merged;

    });



});