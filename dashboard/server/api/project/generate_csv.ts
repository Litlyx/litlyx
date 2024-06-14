
import { ProjectModel } from "@schema/ProjectSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import { EventModel } from '@schema/metrics/EventSchema';
import { VisitModel } from "@schema/metrics/VisitSchema";


export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    const { mode, slice } = getQuery(event);

    let timeSub = 1000 * 60 * 60 * 24;

    if (slice == '0') {
        timeSub = 1000 * 60 * 60 * 24
    } else if (slice == '1') {
        timeSub = 1000 * 60 * 60 * 24 * 7
    } else if (slice == '2') {
        timeSub = 1000 * 60 * 60 * 24 * 7 * 30
    } else if (slice == '3') {
        timeSub = 1000 * 60 * 60 * 24 * 7 * 30 * 12 * 2
    }

    if (mode === 'visits') {

        const visistsReportData = await VisitModel.find({
            project_id,
            created_at: {
                $gt: Date.now() - timeSub
            }
        });

        const csvHeader = [
            "browser",
            "os",
            "continent",
            "country",
            "device",
            "website",
            "page",
            "referrer",
            "created_at",
        ];


        const lines: any[] = [];
        visistsReportData.forEach(line => lines.push(line.toJSON()));

        const result = csvHeader.join(',') + '\n' + lines.map(element => {
            const content: string[] = [];
            for (const key of csvHeader) {
                content.push(element[key]);
            }
            return content.join(',');
        }).join('\n');

        return result;
    } else {
        return '';
    }


});