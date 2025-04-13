import { PaymentServiceHelper } from '~/server/services/PaymentServiceHelper';
import { PremiumModel } from '~/shared/schema/PremiumSchema';

export default defineEventHandler(async event => {

    const data = await getRequestData(event, []);
    if (!data) return;

    const premium = await PremiumModel.findOne({ user_id: data.user.id })
    if (!premium) return;

    const body = await readBody(event);

    return await PaymentServiceHelper.update_customer_info(data.user.id, body);


});