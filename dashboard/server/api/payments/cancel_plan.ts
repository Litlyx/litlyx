import { PremiumModel } from "~/shared/schema/PremiumSchema";


export default defineEventHandler(async event => {

    //TODO: SELFHOST
    
    const ctx = await getRequestContext(event, 'flag:allowAnonRegistered');
    const { user_id } = ctx;

    const tRpc = useTRPC();

    const premiumData = await PremiumModel.findOne({ user_id });
    if (!premiumData) throw createError({ status: 400, message: 'Error getting premium data. Please contact support.' });

    const result = await tRpc.payments.subscription.cancelPlan.mutate({ user_id, customer_id: premiumData.customer_id });
    return result;
});