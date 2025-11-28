

import { MAX_LOG_LIMIT_PERCENT } from './shared/data/broker/Limits';
import { checkLimitsForEmail } from './EmailController';
import { UserLimitModel } from './shared/schema/UserLimitSchema';

export async function checkLimits(user_id: string) {
    const userLimits = await UserLimitModel.findOne({ user_id });
    if (!userLimits) return false;
    const TOTAL_COUNT = userLimits.events + userLimits.visits;
    const COUNT_LIMIT = userLimits.limit;
    if ((TOTAL_COUNT) > COUNT_LIMIT * MAX_LOG_LIMIT_PERCENT) return false;
    await checkLimitsForEmail(userLimits);
    return true;
}