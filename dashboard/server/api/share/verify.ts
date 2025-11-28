import { ProjectShareModel } from "~/shared/schema/project/ProjectShareSchema";



export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'flag:allowAnon');
    const { linkId, password } = getQuery(event)
    const target = await ProjectShareModel.findOne({ link: linkId?.toString(), password: password?.toString() });
    if (!target) return false;
    return true;
}); 