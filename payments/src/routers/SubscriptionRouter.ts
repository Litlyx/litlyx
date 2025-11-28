import { activatePlan, createCheckout, ZActivatePlanInput, ZCreateCheckoutInput, ZCreatePreviewUpgradeInput, createPreviewUpgrade, createUpgrade, ZCreateUpgradeInput, ZCancelPlanInput, cancelPlan } from '../controllers/SubscriptionController';
import { protectedProcedure, router } from '../trpc';


export const subscriptionRouter = router({
    activate: protectedProcedure.input(ZActivatePlanInput).mutation(async (opts) => {
        const result = await activatePlan(opts.input);
        return result;
    }),
    checkout: protectedProcedure.input(ZCreateCheckoutInput).mutation(async (opts) => {
        const result = await createCheckout(opts.input);
        return result;
    }),
    createPreviewUpgrade: protectedProcedure.input(ZCreatePreviewUpgradeInput).query(async (opts) => {
        const result = await createPreviewUpgrade(opts.input);
        return result;
    }),
    createUpgrade: protectedProcedure.input(ZCreateUpgradeInput).mutation(async (opts) => {
        const result = await createUpgrade(opts.input);
        return result;
    }),
    cancelPlan: protectedProcedure.input(ZCancelPlanInput).mutation(async (opts) => {
        const result = await cancelPlan(opts.input);
        return result;
    }),
});