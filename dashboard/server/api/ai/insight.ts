import { AiService } from "~/server/services/ai/AiService";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'permission:ai');
    const { project_id } = ctx;
    const res = await AiService.generateInsight(project_id.toString());
    return res;
});