import { ProjectShareModel, TProjectShare } from "~/shared/schema/project/ProjectShareSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;
    const { id } = getQuery(event);
    if (!id) return;
    await ProjectShareModel.deleteOne({ _id: id?.toString(), project_id });
}); 