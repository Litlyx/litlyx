import { ProjectShareModel } from "~/shared/schema/project/ProjectShareSchema";



export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'flag:allowAnon');
    const { linkId } = getQuery(event)
    const target = await ProjectShareModel.findOne({
        link: linkId?.toString()
    });
    if (!target) return;
    return {
        project_id: target.project_id,
        hasPassword: (target.password != undefined && target.password.length > 0)
    }
}); 