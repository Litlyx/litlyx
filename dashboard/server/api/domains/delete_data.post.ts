
import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Types } from "mongoose";
import { z } from "zod";
import { ProjectCountModel } from "~/shared/schema/project/ProjectsCounts";


const ZDeleteDataBody = z.object({
    domain: z.string(),
    visits: z.boolean(),
    events: z.boolean()
});

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id } = ctx;

    const { domain, visits, events } = await readValidatedBody(event, ZDeleteDataBody.parse);

    taskDeleteDomain(project_id, domain, visits, events);

    return { ok: true }

});


async function taskDeleteDomain(project_id: Types.ObjectId, domain: string, deleteVisits: boolean, deleteEvents: boolean) {

    console.log('Deletation started', project_id.toString(), { domain, deleteVisits, deleteEvents });

    const start = Date.now();

    if (deleteVisits) {
        const deleteVisits = await VisitModel.deleteMany({ project_id, website: domain });
        console.log('Visits deleted', deleteVisits.deletedCount);
    }

    if (deleteEvents === true) {
        const deleteEvents = await EventModel.deleteMany({ project_id, website: domain });
        console.log('Events deleted', deleteEvents.deletedCount);
    }

    // Refresh count

    const events = await EventModel.countDocuments({ project_id });
    const visits = await VisitModel.countDocuments({ project_id });
    await ProjectCountModel.updateOne({ project_id, events, visits }, {}, { upsert: true });

    const s = (Date.now() - start) / 1000;

    console.log(`Deletation done in ${s.toFixed(2)} seconds`);

}