
import { EventModel } from "@schema/metrics/EventSchema";
import { SessionModel } from "@schema/metrics/SessionSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { Types } from "mongoose";
import { getRequestData } from "~/server/utils/getRequestData";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false });
    if (!data) return;

    const { project_id } = data;

    taskDeleteAll(project_id);

    return { ok: true }

});


async function taskDeleteAll(project_id: Types.ObjectId) {

    console.log('Deletation all started');

    const start = Date.now();

    await VisitModel.deleteMany({ project_id });
    await SessionModel.deleteMany({ project_id });
    await EventModel.deleteMany({ project_id });

    const s = (Date.now() - start) / 1000;

    console.log(`Deletation all done in ${s.toFixed(2)} seconds`);

}