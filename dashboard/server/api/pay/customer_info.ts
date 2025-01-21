
import StripeService from '~/server/services/StripeService';

export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false, allowLitlyx: false });
    if (!data) return;

    const { project } = data;

    const customer = await StripeService.getCustomer(project.customer_id);
    if (customer?.deleted) return;
    
    return customer?.address;

});