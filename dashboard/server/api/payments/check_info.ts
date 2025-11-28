import { PremiumModel } from "~/shared/schema/PremiumSchema";


export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'flag:allowAnonRegistered');
    throw createError({ status: 400, message: 'NOT IMPLEMENTED' });
    // const { user_id } = ctx;
    // const tRpc = useTRPC();
    // const premiumData = await PremiumModel.findOne({ user_id });
    // if (!premiumData) throw createError({ status: 400, message: 'Premium data not found. Please contact support.' });
    // const paymentMethods = await tRpc.payments.customer.listMethods.query({ customer_id: premiumData.customer_id });
    // return { paymentMethodsCount: paymentMethods.data.length }
});