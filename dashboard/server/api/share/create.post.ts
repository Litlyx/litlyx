import { ProjectShareModel, TProjectShare } from "~/shared/schema/project/ProjectShareSchema";

import crypto from 'crypto';

async function createNewShareableLink() {
    const link = crypto.randomBytes(16).toString('hex');
    const exists = await ProjectShareModel.findOne({ link });
    if (exists) return await createNewShareableLink();
    return link;
}


export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'pid');
    const { project_id } = ctx;
    const { isPublic, password, description, domain } = await readBody(event);
    const link = await createNewShareableLink();
    await ProjectShareModel.create({
        project_id,
        link,
        domain,
        password: isPublic ? undefined : password,
        description
    });
}); 