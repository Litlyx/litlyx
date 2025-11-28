import { LIMIT_50_EMAIL } from '../../templates/Limit50Email';
import { LIMIT_90_EMAIL } from '../../templates/Limit90Email';
import { LIMIT_MAX_EMAIL } from '../../templates/LimitMaxEmail';
import { PURCHASE_EMAIL } from '../../templates/PurchaseEmail';
import { ANOMALY_VISITS_EVENTS_EMAIL } from '../../templates/AnomalyUsageEmail';
import { ANOMALY_DOMAIN_EMAIL } from '../../templates/AnomalyDomainEmail';
import { CONFIRM_EMAIL } from '../../templates/ConfirmEmail';
import { FORGOT_PASSWORD_EMAIL } from '../../templates/ForgotPasswordEmail';
import { PROJECT_INVITE_EMAIL } from '../../templates/ProjectInviteEmail';
import { PROJECT_INVITE_EMAIL_NO_ACCOUNT } from '../../templates/ProjectInviteEmailNoAccount';
import { PURCHASE_SELFHOST_EMAIL } from '../../templates/PurchaseSelfhostEmail';

import { N1_FREE_TRIAL_STARTED } from '../../templates/free_trial/1-FreeTrialStarted';
import { N2_FREE_TRIAL_10_DAYS_IN } from '../../templates/free_trial/2-FreeTrial10DaysIn';
import { N3_FREE_TRIAL_1_WEEK_LEFT } from '../../templates/free_trial/3-FreeTrial1WeekLeft';
import { N4_FREE_TRIAL_ENDS_TOMORROW } from '../../templates/free_trial/4-FreeTrialEndsTomorrow';
import { N5_FREE_TRIAL_ENDS_TODAY } from '../../templates/free_trial/5-FreeTrialEndsToday';
import { N6_FREE_TRIAL_HAS_ENDED } from '../../templates/free_trial/6-FreeTrialHasEnded';
import { N7_LITLYX_WILL_STOP_COLLECTING } from '../../templates/free_trial/7-LitlyxWillStopCollecting';
import { N8_LITLYX_HAS_STOP_GRACE_PERIOD } from '../../templates/free_trial/8-LitlyxHasStopGracePeriod';


export const EMAIL_TEMPLATES = {
    LIMIT_50_EMAIL,
    LIMIT_90_EMAIL,
    LIMIT_MAX_EMAIL,
    PURCHASE_EMAIL,
    ANOMALY_VISITS_EVENTS_EMAIL,
    ANOMALY_DOMAIN_EMAIL,
    CONFIRM_EMAIL,
    FORGOT_PASSWORD_EMAIL,
    PROJECT_INVITE_EMAIL,
    PROJECT_INVITE_EMAIL_NO_ACCOUNT,

    N1_FREE_TRIAL_STARTED,
    N2_FREE_TRIAL_10_DAYS_IN,
    N3_FREE_TRIAL_1_WEEK_LEFT,
    N4_FREE_TRIAL_ENDS_TOMORROW,
    N5_FREE_TRIAL_ENDS_TODAY,
    N6_FREE_TRIAL_HAS_ENDED,
    N7_LITLYX_WILL_STOP_COLLECTING,
    N8_LITLYX_HAS_STOP_GRACE_PERIOD,

    PURCHASE_SELFHOST_EMAIL
}

export type EMAIL_TEMPLATE_NAME = keyof typeof EMAIL_TEMPLATES;
