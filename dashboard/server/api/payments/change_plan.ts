import { getPlanFromTag } from "~/shared/data/PLANS";
import { PremiumModel } from "~/shared/schema/PremiumSchema";


export default defineEventHandler(async event => {

    //TODO: SELFHOST
    
    const ctx = await getRequestContext(event, 'flag:allowAnonRegistered');
    const { user_id } = ctx;

    const { plan } = getQuery(event);

    const newPlan = getPlanFromTag(plan as any);
    if (!newPlan) throw createError({ status: 400, message: 'Plan not valid. Please contact support.' });

    const tRpc = useTRPC();

    const premiumData = await PremiumModel.findOne({ user_id });
    if (!premiumData) throw createError({ status: 400, message: 'Premium data not found. Please contact support.' });

    const paymentMethods = await tRpc.payments.customer.listMethods.query({ customer_id: premiumData.customer_id });

    const config = useRuntimeConfig();

    const redirect_url = config.BASE_URL + '/payment_ok';

    if (paymentMethods.data.length > 0) {

        if (premiumData.payment_failed) {
            const checkout_url = await tRpc.payments.subscription.checkout.mutate({ customer_id: premiumData.customer_id, user_id: premiumData.user_id.toString(), plan_tag: newPlan.TAG, redirect_url });
            return { ok: true, soft: false, url: checkout_url }
        } else {
            return ({ ok: true, soft: true, url: `/checkout?plan_tag=${newPlan.TAG}` });
            // await tRpc.payments.subscription.activate.mutate({ customer_id: premiumData.customer_id, user_id: premiumData.user_id.toString(), plan_tag: newPlan.TAG });
            // return { ok: true }
        }

    } else {
        const checkout_url = await tRpc.payments.subscription.checkout.mutate({ customer_id: premiumData.customer_id, user_id: premiumData.user_id.toString(), plan_tag: newPlan.TAG, redirect_url });
        return { ok: true, soft: false, url: checkout_url }
    }


});