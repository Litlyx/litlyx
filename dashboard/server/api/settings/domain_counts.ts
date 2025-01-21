
import { VisitModel } from "@schema/metrics/VisitSchema";
import { getRequestDataOld } from "~/server/utils/getRequestData";

export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false });
    if (!data) return;

    const { project_id } = data;

    const { domain } = getQuery(event);

    try {
        const resultData = await VisitModel.aggregate([
            {
                $match: {
                    project_id,
                    website: domain
                }
            },
            {
                $group: {
                    _id: "$session",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "events",
                    let: { sessionId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$session", "$$sessionId"] } } },
                        { $match: { project_id } },
                        { $project: { _id: 1 } }
                    ],
                    as: "events"
                }
            },
            {
                $lookup: {
                    from: "sessions",
                    let: { sessionId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$session", "$$sessionId"] } } },
                        { $match: { project_id } },
                        { $project: { _id: 1 } }
                    ],
                    as: "sessions"
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    "events._id": 1,
                    "sessions._id": 1
                }
            }
        ], { maxTimeMS: 5000 }) as { _id: string, count: number, events: { _id: string }[], sessions: { _id: string }[] }[]


        const visits = resultData.reduce((a, e) => a + e.count, 0);

        const sessions = resultData.reduce((a, e) => {
            const count = e.sessions.length;
            return a + count;
        }, 0);

        const events = resultData.reduce((a, e) => {
            const count = e.events.length;
            return a + count;
        }, 0);

        return { visits, sessions, events, error: false, message: '' };
    } catch (ex: any) {
        return { error: true, message: ex.message.toString(), visits: -1, sessions: -1, events: -1 }
    }
});