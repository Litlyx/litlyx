import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { SupabaseIntegrationModel } from '@schema/integrations/SupabaseIntegrationSchema';

export default defineEventHandler(async event => {

    const project_id = getHeader(event, 'x-pid');
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const integrations = await SupabaseIntegrationModel.find({ project_id });
    return integrations;

});