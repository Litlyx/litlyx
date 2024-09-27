import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { IntegrationsCredentialsModel } from '@schema/integrations/IntegrationsCredentialsSchema';

export default defineEventHandler(async event => {

    const project_id = getHeader(event, 'x-pid');
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const credentials = await IntegrationsCredentialsModel.findOne({ project_id });

    return {
        supabase: {
            anon_key: credentials?.supabase_anon_key || '',
            service_role_key: credentials?.supabase_service_role_key || '',
            url: credentials?.supabase_url || ''
        }
    }

});