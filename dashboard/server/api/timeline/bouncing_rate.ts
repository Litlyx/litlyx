import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis } from "~/server/services/CacheService";
import DateService from "@services/DateService";
import mongoose from "mongoose";

export default defineEventHandler(async event => {


    const data = await getRequestData(event, { requireSchema: false, requireSlice: true });
    if (!data) return;

    const { pid, from, to, slice, project_id } = data;


    const cacheKey = `timeline:bouncing_rate:${pid}:${from}:${to}`;
    const cacheExp = 60 * 60; //1 hour

    return await Redis.useCacheV2(cacheKey, cacheExp, async (noStore, updateExp) => {

        const dateDistDays = (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)
        // 15 Days
        if (slice === 'hour' && (dateDistDays > 15)) throw Error('Date gap too big for this slice');
        // 1 Year
        if (slice === 'day' && (dateDistDays > 365)) throw Error('Date gap too big for this slice');
        // 3 Years
        if (slice === 'month' && (dateDistDays > 365 * 3)) throw Error('Date gap too big for this slice');


        const allDates = DateService.createBetweenDates(from, to, slice as any);

        const result: { _id: string, count: number }[] = [];

        for (const date of allDates.dates) {

            const visits = await VisitModel.aggregate([
                {
                    $match: {
                        project_id: project_id,
                        created_at: {
                            $gte: date.startOf(slice as any).toDate(),
                            $lte: date.endOf(slice as any).toDate()
                        }
                    },
                },
                { $group: { _id: "$session", count: { $sum: 1, } } },
            ]);

            const sessions = await SessionModel.aggregate([
                {
                    $match: {
                        project_id: project_id,
                        created_at: {
                            $gte: date.startOf(slice as any).toDate(),
                            $lte: date.endOf(slice as any).toDate()
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
            result.push({ 
                _id: date.toISOString(), 
                count: bouncing_rate
             });
        }

        return result;

    });
});