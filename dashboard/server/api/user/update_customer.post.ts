import { PremiumModel } from '~/shared/schema/PremiumSchema';

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event);

    const { user_id } = ctx;

    const premium = await PremiumModel.findOne({ user_id })
    if (!premium) throw createError({ status: 400, message: 'Error getting user. Please contact support.' });

    const body = await readBody(event);

    const { payments } = useTRPC();

    const result = await payments.customer.update.mutate({ user_id, address: body });
    return result;
});