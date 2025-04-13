
import { PaymentServiceHelper } from '~/server/services/PaymentServiceHelper';
import { PremiumModel } from '~/shared/schema/PremiumSchema';

export default defineEventHandler(async event => {

    const data = await getRequestData(event, []);
    if (!data) return;

    const premium = await PremiumModel.findOne({ user_id: data.user.id })
    if (!premium) return;

    const [ok, customerInfoOrError] = await PaymentServiceHelper.customer_info(data.user.id);
    if (!ok) throw customerInfoOrError;

    return customerInfoOrError;

});