import { UserLimitModel } from "@schema/UserLimitSchema";
import { PremiumModel } from "~/shared/schema/PremiumSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], ['OWNER']);
    if (!data) return;

    const premium = await PremiumModel.findOne({ user_id: data.user.id });
    if (!premium) return;

    if (premium.subscription_id === 'onetime') {

        const userLimits = await UserLimitModel.findOne({ user_id: data.user.id });
        if (!userLimits) return setResponseStatus(event, 400, 'User limits not found');

        const result = {
            premium: premium.premium_type > 0,
            premium_type: premium.premium_type,
            billing_start_at: userLimits.billing_start_at,
            billing_expire_at: userLimits.billing_expire_at,
            limit: userLimits.limit,
            count: userLimits.events + userLimits.visits,
            subscription_status: 'One time'
        }

        return result;
    }

    const userLimits = await UserLimitModel.findOne({ user_id: data.user.id });
    if (!userLimits) return setResponseStatus(event, 400, 'User limits not found');


    const result = {
        premium: premium.premium_type > 0,
        premium_type: premium.premium_type,
        billing_start_at: userLimits.billing_start_at,
        billing_expire_at: userLimits.billing_expire_at,
        limit: userLimits.limit,
        count: userLimits.events + userLimits.visits,
        subscription_status: ''
    }

    return result;

});