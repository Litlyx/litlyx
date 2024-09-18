import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import StripeService from '~/server/services/StripeService';


export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return setResponseStatus(event, 400, 'Cannot get project_id');

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user, false);
    if (!project) return setResponseStatus(event, 400, 'Cannot get user from project_id');

    if (!project.customer_id) return setResponseStatus(event, 400, 'Project has no customer_id');

    const body = await readBody(event);
    const res = await StripeService.setCustomerInfo(project.customer_id, body);

    return { ok: true, data: res }

});