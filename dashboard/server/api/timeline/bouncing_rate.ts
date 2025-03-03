
import { SessionModel } from "@schema/metrics/SessionSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis } from "~/server/services/CacheService";
import DateService from "@services/DateService";

import { checkSliceValidity } from "~/server/services/TimelineService";

export default defineEventHandler(async event => {


    const data = await getRequestData(event, ['SLICE', 'RANGE', 'DOMAIN'], ['WEB']);
    if (!data) return;

    const { pid, from, to, slice, project_id, domain } = data;


    const cacheKey = `timeline:bouncing_rate:${pid}:${slice}:${from}:${to}`;
    const cacheExp = 60 * 60; //1 hour

    return await Redis.useCacheV2(cacheKey, cacheExp, async () => {

        const [sliceValid, errorOrDays] = checkSliceValidity(from, to, slice);
        if (!sliceValid) throw Error(errorOrDays);

        const allDates = DateService.generateDateSlices(slice, new Date(from), new Date(to));

        const result: { _id: string, count: number }[] = [];

        for (const date of allDates) {

            const visits = await VisitModel.aggregate([
                {
                    $match: {
                        project_id: project_id,
                        created_at: {
                            $gte: DateService.startOfSlice(date, slice),
                            $lte: DateService.endOfSlice(date, slice)
                        },
                        website: domain
                    },
                },
                { $group: { _id: "$session", count: { $sum: 1, } } },
            ]);

            const sessions = await SessionModel.aggregate([
                {
                    $match: {
                        project_id: project_id,
                        created_at: {
                            $gte: DateService.startOfSlice(date, slice),
                            $lte: DateService.endOfSlice(date, slice)
                        }
                    },
                },
                {
                    $group: {
                        _id: "$session", count: { $sum: 1, },
                        duration: { $sum: '$duration' }
                    }
                },
            ]);

            const total = visits.length;
            const bounced = sessions.filter(e => (e.duration / e.count) < 1).length;
            const bouncing_rate = 100 / total * bounced;
            result.push({ _id: date.toISOString(), count: bouncing_rate });
        }

        return result;

    });
});