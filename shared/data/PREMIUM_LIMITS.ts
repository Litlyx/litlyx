

export const PREMIUM_PLANS = [
    { id: 0, tag: 'FREE', name: 'Free' },
    { id: 1, tag: 'PLAN_1', name: 'Premium 1' },
    { id: 2, tag: 'PLAN_2', name: 'Premium 2' },
    { id: 3, tag: 'PLAN_3', name: 'Premium 3' },
    { id: 99, tag: 'PLAN_99', name: 'Premium 99' },
] as const;

export function getPlanFromPremiumType(premium_type?: number) {
    if (!premium_type) return PREMIUM_PLANS[0];
    const plan = PREMIUM_PLANS.find(e => e.id === premium_type);
    if (!plan) return PREMIUM_PLANS[0];
    return plan;
}

export type PREMIUM_PLAN_TAG = typeof PREMIUM_PLANS[number]['tag'];

export type PROJECT_LIMIT = {
    COUNT_LIMIT: number,
    AI_MESSAGE_LIMIT: number,
}

export const PREMIUM_LIMITS: Record<PREMIUM_PLAN_TAG, PROJECT_LIMIT> = {
    FREE: {
        COUNT_LIMIT: 3_000,
        AI_MESSAGE_LIMIT: 10
    },
    PLAN_1: {
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100
    },
    PLAN_2: {
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 5_000
    },
    PLAN_3: {
        COUNT_LIMIT: 2_000_000,
        AI_MESSAGE_LIMIT: 10_000
    },
    PLAN_99: {
        COUNT_LIMIT: 10_000_000,
        AI_MESSAGE_LIMIT: 100_000
    }
}