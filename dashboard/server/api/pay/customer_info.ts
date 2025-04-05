
import StripeService from '~/server/services/StripeService';
import { PremiumModel } from '~/shared/schema/PremiumSchema';

export default defineEventHandler(async event => {

    const data = await getRequestData(event, []);
    if (!data) return;

    const premium = await PremiumModel.findOne({ user_id: data.user.id })
    if (!premium) return;

    const customer = await StripeService.getCustomer(premium.customer_id);
    if (customer?.deleted) return;

    return customer?.address;

});