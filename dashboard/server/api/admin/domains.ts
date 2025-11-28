import { Types } from "mongoose";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'admin');

    const { pid } = getQuery(event);

    const start = performance.now();
    const domains = await VisitModel.distinct('website', { project_id: new Types.ObjectId(pid as string) });
    const end = performance.now();

    return domains;

});