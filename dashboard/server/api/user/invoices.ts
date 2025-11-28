
import { PremiumModel } from '~/shared/schema/PremiumSchema';

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event);

    const { user_id } = ctx;

    const premium = await PremiumModel.findOne({ user_id })
    if (!premium) throw createError({ status: 400, message: 'Error getting user. Please contact support.' });

    const { payments } = useTRPC();

    const invoices = await payments.invoice.invoices.query({ user_id })
    return invoices;

});