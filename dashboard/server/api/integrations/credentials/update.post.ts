import { IntegrationsCredentialsModel } from "@schema/integrations/IntegrationsCredentialsSchema";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";

export default defineEventHandler(async event => {

    const project_id = getHeader(event, 'x-pid');
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const body = await readBody(event);

    const res = await IntegrationsCredentialsModel.updateOne({ project_id }, {
        supabase_anon_key: body.supabase_anon_key || '',
        supabase_service_role_key: body.supabase_service_role_key || '',
        supabase_url: body.supabase_url || '',
    }, { upsert: true });

    return { ok: res.acknowledged };

});