
import { EventModel } from "@schema/metrics/EventSchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Types } from "mongoose";
import { getRequestData } from "~/server/utils/getRequestData";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false });
    if (!data) return;

    const { project_id } = data;

    const { domain, visits, events, sessions } = await readBody(event);

    taskDeleteDomain(project_id, domain, visits, events, sessions);

    return { ok: true }

});


async function taskDeleteDomain(project_id: Types.ObjectId, domain: string, deleteVisits: boolean, deleteEvents: boolean, deleteSessions: boolean) {

    console.log('Deletation started');

    const start = Date.now();

    const data = await VisitModel.aggregate([
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
    ]) as { _id: string, events: { _id: string }[], sessions: { _id: string }[] }[]


    if (deleteSessions === true) {
        const sessions = data.flatMap(e => e.sessions).map(e => e._id.toString());
        const batchSize = 1000;
        for (let i = 0; i < sessions.length; i += batchSize) {
            const batch = sessions.slice(i, i + batchSize);
            await SessionModel.deleteMany({ _id: { $in: batch } });
        }
    }

    if (deleteEvents === true) {
        const sessions = data.flatMap(e => e.sessions).map(e => e._id.toString());
        const batchSize = 1000;
        for (let i = 0; i < sessions.length; i += batchSize) {
            const batch = sessions.slice(i, i + batchSize);
            await EventModel.deleteMany({ _id: { $in: batch } });
        }
    }

    if (deleteVisits === true) {
        await VisitModel.deleteMany({ project_id, website: domain })
    }

    const s = (Date.now() - start) / 1000;

    console.log(`Deletation done in ${s.toFixed(2)} seconds`);

}