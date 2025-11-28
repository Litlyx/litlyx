import { getPlanFromId, PLAN_DATA } from "~/shared/data/PLANS";
import { PasswordModel } from "~/shared/schema/PasswordSchema";
import { PremiumModel } from "~/shared/schema/PremiumSchema";
import { UserLimitModel } from "~/shared/schema/UserLimitSchema";

export type TUserPlanInfo = {
    premium: boolean,
    premium_type: number,
    limit: number,
    count: number,
    start_at: number,
    end_at: number,
    payment_failed: boolean,
    canceled: boolean
}

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event);

    const { user_id } = ctx;

    const premium = await PremiumModel.findOne({ user_id });
    if (!premium) throw createError({ status: 400, message: 'Error getting plan. Please contact support.' });

    const limits = await UserLimitModel.findOne({ user_id });
    if (!limits) throw createError({ status: 400, message: 'Error getting plan. Please contact support.' });

    const result: TUserPlanInfo = {
        premium: premium.premium_type > 0,
        premium_type: premium.premium_type,
        limit: limits.limit,
        count: limits.visits + limits.events,
        start_at: new Date(limits.billing_start_at).getTime(),
        end_at: new Date(limits.billing_expire_at).getTime(),
        payment_failed: premium.payment_failed ?? false,
        canceled: premium.plan_cancelled ?? false
    }

    return result;
});

