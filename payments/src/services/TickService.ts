import { CronJob } from 'cron';
import { PremiumModel } from '../shared/schema/PremiumSchema';
import { EmailNotifyModel, TEmailNotify } from '../shared/schema/emails/EmailNotifySchema';
import { email_client } from '../trcp_client';
import { UserModel } from '../shared/schema/UserSchema';
import { UserLimitModel } from '../shared/schema/UserLimitSchema';
import { PLAN_DATA, PLAN_DATA_MAP, PLAN_TAG, PLAN_TAGS, PREMIUM_PLAN } from '../shared/data/PLANS';


export async function startTickService() {
    const job = new CronJob('0 */6 * * *', () => {
        console.log(new Date().toLocaleString('it-IT'), 'JOB STARTED');
        manageFreeTrials(0, 20);
        manageFreeTrialsEnded(0, 20);
    });
    job.start();
}

const DAY = 1000 * 60 * 60 * 24;
const MONTH = DAY * 30;


async function getBestPlanAndVisits(user_id: string) {
    const limits = await UserLimitModel.findOne({ user_id });
    if (!limits) return { visits: 0, plan: 'Mini' };
    const { visits } = limits;

    const planKey = Object.keys(PREMIUM_PLAN).find(e => {
        const target: PLAN_DATA = PREMIUM_PLAN[e];
        if (target.ID <= 8000) return false;
        if (target.COUNT_LIMIT > visits) return true;
    });

    if (!planKey) return { visits: 0, plan: 'Mini' };

    return { visits, plan: PREMIUM_PLAN[planKey].NAME }


}


async function manageFreeTrials(skip: number, limit: number) {
    const premiumData = await PremiumModel.find({ premium_type: 7006 }, {}, { skip, limit });

    console.log('Finding free trials', { skip, limit }, { count: premiumData.length });

    if (premiumData.length == 0) return;
    for (const premiumItem of premiumData) {

        const user = await UserModel.findOne({ _id: premiumItem.user_id });
        if (!user) continue;

        let notifyData = await EmailNotifyModel.findOne({ user_id: premiumItem.user_id });

        if (!notifyData) {
            await EmailNotifyModel.create({
                user_id: premiumItem.user_id,
                n1: false, n2: false, n3: false, n4: false,
                n5: false, n6: false, n7: false, n8: false
            });
            notifyData = await EmailNotifyModel.findOne({ user_id: premiumItem.user_id });
        }
        if (!notifyData) continue;


        const started_at_timestamp = new Date(premiumItem.expire_at).getTime() - MONTH;
        const end_at_timestamp = new Date(premiumItem.expire_at).getTime();

        // console.log(premiumItem._id.toString(), new Date(started_at_timestamp).toLocaleString('it-IT'), new Date(end_at_timestamp).toLocaleString('it-IT'));


        if (Date.now() >= end_at_timestamp - DAY) {
            const data = await getBestPlanAndVisits(premiumItem.user_id.toString());
            await checkEmail_N5_today(notifyData, premiumItem.user_id.toString(), user.email, data.plan, data.visits);
        } else if (Date.now() >= end_at_timestamp - DAY * 2) {
            const data = await getBestPlanAndVisits(premiumItem.user_id.toString());
            await checkEmail_N4_tomorrow(notifyData, premiumItem.user_id.toString(), user.email, data.plan, data.visits);
        } else if (Date.now() >= end_at_timestamp - DAY * 7) {
            await checkEmail_N3_1WeekLeft(notifyData, premiumItem.user_id.toString(), user.email);
        } else if (Date.now() - started_at_timestamp >= DAY * 10) {
            await checkEmail_N2_10DaysIn(notifyData, premiumItem.user_id.toString(), user.email);
        }
    }

    setTimeout(() => {
        manageFreeTrials(skip + limit, limit);
    }, 1)
}

async function manageFreeTrialsEnded(skip: number, limit: number) {
    const premiumData = await PremiumModel.find({ premium_type: 7999 }, {}, { skip, limit });

    console.log('Finding free trials ended', { skip, limit }, { count: premiumData.length });

    if (premiumData.length == 0) return;
    for (const premiumItem of premiumData) {

        const user = await UserModel.findOne({ _id: premiumItem.user_id });
        if (!user) continue;
        const notifyData = await EmailNotifyModel.findOne({ user_id: premiumItem.user_id });
        if (!notifyData) continue;

        const started_at_timestamp = new Date(premiumItem.expire_at).getTime() - MONTH * 12;
        const end_at_timestamp = new Date(premiumItem.expire_at).getTime();

        // console.log(premiumItem._id.toString(), new Date(started_at_timestamp).toLocaleString('it-IT'), new Date(end_at_timestamp).toLocaleString('it-IT'));

        if (Date.now() >= started_at_timestamp + DAY * 12) {
            await checkEmail_N7_will_stop(notifyData, premiumItem.user_id.toString(), user.email);
        }
        if (Date.now() >= started_at_timestamp + DAY * 14) {
            await checkEmail_N8_stop_grace(notifyData, premiumItem.user_id.toString(), user.email);
        }

    }

    setTimeout(() => {
        manageFreeTrialsEnded(skip + limit, limit);
    }, 1)

}

async function checkEmail_N2_10DaysIn(notifyData: TEmailNotify, user_id: string, email: string) {
    if (notifyData.n2) return;
    console.log('SENDING: send_trial_2_10_days_in', email);
    await email_client.email.send_trial_2_10_days_in.mutate({ email });
    await EmailNotifyModel.updateOne({ user_id }, { n2: true });
}

async function checkEmail_N3_1WeekLeft(notifyData: TEmailNotify, user_id: string, email: string) {
    if (notifyData.n3) return;
    console.log('SENDING: send_trial_3_1_week_left', email);
    await email_client.email.send_trial_3_1_week_left.mutate({ email });
    await EmailNotifyModel.updateOne({ user_id }, { n3: true });
}

async function checkEmail_N4_tomorrow(notifyData: TEmailNotify, user_id: string, email: string, plan: string, visits: number) {
    if (notifyData.n4) return;
    console.log('SENDING: send_trial_4_ends_tomorrow', email);
    await email_client.email.send_trial_4_ends_tomorrow.mutate({ email, plan, visits });
    await EmailNotifyModel.updateOne({ user_id }, { n4: true });
}

async function checkEmail_N5_today(notifyData: TEmailNotify, user_id: string, email: string, plan: string, visits: number) {
    if (notifyData.n5) return;
    console.log('SENDING: send_trial_5_ends_today', email);
    await email_client.email.send_trial_5_ends_today.mutate({ email, plan, visits });
    await EmailNotifyModel.updateOne({ user_id }, { n5: true });
}

async function checkEmail_N7_will_stop(notifyData: TEmailNotify, user_id: string, email: string) {
    if (notifyData.n7) return;
    console.log('SENDING: send_trial_7_stop_collecting', email);
    await email_client.email.send_trial_7_stop_collecting.mutate({ email });
    await EmailNotifyModel.updateOne({ user_id }, { n7: true });
}

async function checkEmail_N8_stop_grace(notifyData: TEmailNotify, user_id: string, email: string) {
    if (notifyData.n8) return;
    console.log('SENDING: send_trial_8_stop_grace_period', email);
    await email_client.email.send_trial_8_stop_grace_period.mutate({ email });
    await EmailNotifyModel.updateOne({ user_id }, { n8: true });
}