

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

export function getPlanFromPremiumTag(tag: PREMIUM_PLAN_TAG) {
    const plan = PREMIUM_PLANS.find(e => e.tag === tag);
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


export type STRIPE_PLAN = {
    price: string
}

export const STRIPE_PLANS: Record<PREMIUM_PLAN_TAG, STRIPE_PLAN> = {
    FREE: {
        price: 'price_1PNbHYB2lPUiVs9VZP32xglF'
    },
    PLAN_1: {
        price: 'price_1PNZjVB2lPUiVs9VrsTbJL04'
    },
    PLAN_2: {
        price: ''
    },
    PLAN_3: {
        price: ''
    },
    PLAN_99: {
        price: ''
    }
}

export function getPlanTagFromStripePrice(price: string): PREMIUM_PLAN_TAG | undefined {
    for (const plan of PREMIUM_PLANS.map(e => e.tag)) {
        const stripePrice = STRIPE_PLANS[plan].price;
        if (stripePrice === price) return plan;
    }
}