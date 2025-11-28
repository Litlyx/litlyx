import { PremiumModel } from "~/shared/schema/PremiumSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'flag:allowAnonRegistered');


    //TODO: SELFHOST
    
    const { user_id } = ctx;

    const { plan_tag } = getQuery(event);

    const tRpc = useTRPC();

    const premiumData = await PremiumModel.findOne({ user_id })
    if (!premiumData) throw createError({ status: 400, message: 'Cannot get premium data. Please contact support.' });


    const preview = await tRpc.payments.subscription.createUpgrade.mutate({
        user_id,
        customer_id: premiumData.customer_id,
        plan_tag: plan_tag as string
    });

    return preview;

});