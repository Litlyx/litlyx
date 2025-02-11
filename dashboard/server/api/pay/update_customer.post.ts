import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import StripeService from '~/server/services/StripeService';


export default defineEventHandler(async event => {

    const data = await getRequestData(event, []);
    if (!data) return;

    const { project } = data;
    
    if (!project.customer_id) return setResponseStatus(event, 400, 'Project has no customer_id');

    const body = await readBody(event);
    const res = await StripeService.setCustomerInfo(project.customer_id, body);

    return { ok: true, data: res }

});