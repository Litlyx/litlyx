
import { UserModel } from "@schema/UserSchema";
import { ProjectLinkModel } from "~/shared/schema/project/ProjectLinkSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const { project_id, project } = data;

    const owner = await UserModel.findById(project.owner);
    if (!owner) return setResponseStatus(event, 400, 'No owner');

    const links = await ProjectLinkModel.find({ project_id });
    return links;

});