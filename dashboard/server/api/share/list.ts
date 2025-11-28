import { ProjectShareModel, TProjectShare } from "~/shared/schema/project/ProjectShareSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;
    const list = await ProjectShareModel.find({ project_id });
    return list.map(e => e.toJSON()) as TProjectShare[];
}); 