import { getTimeline } from "./generic";
import { VisitModel } from "@schema/metrics/VisitSchema";
import DateService from "@services/DateService";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const { slice, referrer, from, to } = await readBody(event);

    const { group, sort, fromParts } = DateService.getQueryDateRange(slice);

    const aggregation = [
        {
            $match: {
                project_id: project._id,
                created_at: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                },
                referrer
            }
        },
        { $group: { _id: group, count: { $sum: 1 } } },
        { $sort: sort },
        { $project: { _id: { $dateFromParts: fromParts }, count: "$count" } }
    ]

    const timelineReferrers: { _id: string, count: number }[] = await VisitModel.aggregate(aggregation);

    const filledDates = DateService.fillDates(timelineReferrers.map(e => e._id), slice);
    const merged = DateService.mergeFilledDates(filledDates, timelineReferrers, '_id', slice, { count: 0 });
    return merged;

});