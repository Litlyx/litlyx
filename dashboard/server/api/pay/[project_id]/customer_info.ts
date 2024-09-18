import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import StripeService from '~/server/services/StripeService';


export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user, false);
    if (!project) return;

    if (!project.customer_id) return;

    const customer = await StripeService.getCustomer(project.customer_id);
    if (customer?.deleted) return;
    
    return customer?.address;

});