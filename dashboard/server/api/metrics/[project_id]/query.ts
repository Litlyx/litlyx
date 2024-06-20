import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { ProjectModel } from "@schema/ProjectSchema";

export default defineEventHandler(async event => {

    const user = getRequestUser(event);
    if (!user?.logged) return;
    const project_id = getRequestProjectId(event);
    if (!project_id) return;
    const project = await ProjectModel.findOne({ _id: project_id });
    if (!project) return;

    const [hasAccess] = await hasAccessToProject(user.id, project_id, project)
    if (!hasAccess) return;

    const query = getQuery(event);

    const { orderBy, order, page, limit, type } = query;

    const limitValue = limit ? parseInt(limit.toString()) : 20;
    const skipValue = page ? (parseInt(page.toString()) - 1) * limitValue : 0;

    if (type == '0') {
        const visits = await VisitModel.find({ project_id: project }, {}, {
            limit: limitValue,
            skip: skipValue,
            sort: { [(orderBy || '').toString()]: order == 'asc' ? 1 : -1 }
        });
        return visits;
    } else {
        const events = await EventModel.find({ project_id: project }, {}, {
            limit: limitValue,
            skip: skipValue,
            sort: { [(orderBy || '').toString()]: order == 'asc' ? 1 : -1 }
        });
        return events;
    }

});