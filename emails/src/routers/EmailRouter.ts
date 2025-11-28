import { protectedProcedure, router } from '../trpc';
import { EmailService } from '../services/EmailService';
import z from 'zod';

const ZWelcomeInput = z.object({ email: z.string().email() });
const ZConfirmInput = z.object({ email: z.string().email(), link: z.string() });
const ZInviteInput = z.object({ email: z.string().email(), project_name: z.string(), link: z.string() });
const ZLimitInput = z.object({ email: z.string().email() });
const ZResetPasswordInput = z.object({ email: z.string().email(), link: z.string() });


const ZEmailWithoutParamsInput = z.object({ email: z.string().email() });

const ZSelfhostedInput = z.object({ email: z.string().email(), code: z.string() });

const ZTrialEndsTomorrowInput = z.object({
    email: z.string().email(),
    visits: z.number(),
    plan: z.string()
});

const ZTrialEndsTodayInput = z.object({
    email: z.string().email(),
    visits: z.number(),
    plan: z.string()
});

export const emailRouter = router({
    sendConfirmEmail: protectedProcedure.input(ZConfirmInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: 'Confirm your email',
            template: 'CONFIRM_EMAIL',
            params: {
                'CONFIRM_LINK': opts.input.link
            }
        });
        return { ok: result };
    }),
    sendInviteEmail: protectedProcedure.input(ZInviteInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: '⚡ Invite',
            template: 'PROJECT_INVITE_EMAIL',
            params: {
                'Workspace_Name': opts.input.project_name,
                'LINK': opts.input.link,
            }
        });
        return { ok: result };
    }),
    sendLimitEmail50: protectedProcedure.input(ZLimitInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "⚡ You've reached 50% limit on Litlyx",
            template: 'LIMIT_50_EMAIL',
            params: {}
        });
        return { ok: result };
    }),
    sendLimitEmail90: protectedProcedure.input(ZLimitInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "⚡ You've reached 90% limit on Litlyx",
            template: 'LIMIT_90_EMAIL',
            params: {}
        });
        return { ok: result };
    }),
    sendLimitEmailMax: protectedProcedure.input(ZLimitInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "🚨 You've reached your limit on Litlyx!",
            template: 'LIMIT_MAX_EMAIL',
            params: {}
        });
        return { ok: result };
    }),
    sendResetPasswordEmail: protectedProcedure.input(ZResetPasswordInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Password reset",
            template: 'FORGOT_PASSWORD_EMAIL',
            params: {
                'LINK': opts.input.link
            }
        });
        return { ok: result };
    }),

    send_trial_1_started: protectedProcedure.input(ZEmailWithoutParamsInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Your Litlyx dashboard is live",
            template: 'N1_FREE_TRIAL_STARTED',
            params: {}
        });
        return { ok: result };
    }),
    send_trial_2_10_days_in: protectedProcedure.input(ZEmailWithoutParamsInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Litlyx is tracking your stats",
            template: 'N2_FREE_TRIAL_10_DAYS_IN',
            params: {}
        });
        return { ok: result };
    }),
    send_trial_3_1_week_left: protectedProcedure.input(ZEmailWithoutParamsInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Your Litlyx trial ends in 1 week",
            template: 'N3_FREE_TRIAL_1_WEEK_LEFT',
            params: {}
        });
        return { ok: result };
    }),
    send_trial_4_ends_tomorrow: protectedProcedure.input(ZTrialEndsTomorrowInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Your Litlyx free trial ends tomorrow",
            template: 'N4_FREE_TRIAL_ENDS_TOMORROW',
            params: {
                'NUMBER_OF_VISITS': opts.input.visits.toString(),
                'PLANS_RECOMMENDED': opts.input.plan
            }
        });
        return { ok: result };
    }),
    send_trial_5_ends_today: protectedProcedure.input(ZTrialEndsTodayInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Your Litlyx free trial ends today",
            template: 'N5_FREE_TRIAL_ENDS_TODAY',
            params: {
                'NUMBER_OF NUMBER_OF_VISITS': opts.input.visits.toString(),
                'PLANS_RECOMMENDED': opts.input.plan
            }
        });
        return { ok: result };
    }),
    send_trial_6_ended: protectedProcedure.input(ZEmailWithoutParamsInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Your Litlyx free trial has ended",
            template: 'N6_FREE_TRIAL_HAS_ENDED',
            params: {}
        });
        return { ok: result };
    }),

    send_trial_7_stop_collecting: protectedProcedure.input(ZEmailWithoutParamsInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Litlyx Tracking stops in 2 days",
            template: 'N7_LITLYX_WILL_STOP_COLLECTING',
            params: {}
        });
        return { ok: result };
    }),

    send_trial_8_stop_grace_period: protectedProcedure.input(ZEmailWithoutParamsInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Litlyx Tracking has stopped",
            template: 'N8_LITLYX_HAS_STOP_GRACE_PERIOD',
            params: {}
        });
        return { ok: result };
    }),

    sendPurchaseEmail: protectedProcedure.input(ZEmailWithoutParamsInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Your Litlyx plan has been upgraded",
            template: 'PURCHASE_EMAIL',
            params: {}
        });
        return { ok: result };
    }),

    sendPurchaseSelfhostedEmail: protectedProcedure.input(ZSelfhostedInput).mutation(async (opts) => {
        const result = await EmailService.sendGenericEmail({
            target: opts.input.email,
            subject: "Your Litlyx Pro License Key",
            template: 'PURCHASE_SELFHOST_EMAIL',
            params: {
                'LICENSE_KEY_CODE': opts.input.code
            }
        });
        return { ok: result };
    }),

});