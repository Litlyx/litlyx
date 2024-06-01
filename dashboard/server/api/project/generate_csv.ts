
import { ProjectModel } from "@schema/ProjectSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import { EventModel } from '@schema/metrics/EventSchema';


export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');


    const eventsReportData = await EventModel.find({
        project_id: project._id,
        created_at: { $gt: Date.now() - 1000 * 60 * 60 * 24 * 7 + 30 }
    });

    const csvLines: string[][] = [['name']];
    eventsReportData.forEach(e => {
        csvLines.push([e.name])
    });

    return csvLines.map(row => {
        return row.join(',');
    }).join('\n');


});