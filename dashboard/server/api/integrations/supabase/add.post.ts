import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { SupabaseIntegrationModel } from "@schema/integrations/SupabaseIntegrationSchema";

export default defineEventHandler(async event => {

    const project_id = getHeader(event, 'x-pid');
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const { chart_type, table_name, xField, yMode, from, to, slice, name } = await readBody(event);

    if (!project.premium) {
        const supabaseIntegrationsCount = await SupabaseIntegrationModel.countDocuments({ project_id });
        if (supabaseIntegrationsCount > 0) return setResponseStatus(event, 400, 'LIMIT_REACHED');
    }

    await SupabaseIntegrationModel.create({
        name,
        project_id, chart_type,
        table_name, xField, yMode,
        from, to, slice,
    });

    return { ok: true };

});