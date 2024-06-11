
export type PREMIUM_TAG = typeof PREMIUM_TAGS[number];

export const PREMIUM_TAGS = [
    'FREE', 'PLAN_1', 'PLAN_2', 'CUSTOM_1'
] as const;


export type PREMIUM_DATA = {
    COUNT_LIMIT: number,
    AI_MESSAGE_LIMIT: number,
    PRICE: string,
    PRICE_TEST: string,
    ID: number
}

export const PREMIUM_PLAN: Record<PREMIUM_TAG, PREMIUM_DATA> = {
    FREE: {
        ID: 0,
        COUNT_LIMIT: 3_000,
        AI_MESSAGE_LIMIT: 10,
        PRICE: 'price_1POKCMB2lPUiVs9VLe3QjIHl',
        PRICE_TEST: 'price_1PNbHYB2lPUiVs9VZP32xglF'
    },
    PLAN_1: {
        ID: 1,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1POKCOB2lPUiVs9VC13s2rQw',
        PRICE_TEST: 'price_1PNZjVB2lPUiVs9VrsTbJL04'
    },
    PLAN_2: {
        ID: 2,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 5_000,
        PRICE: 'price_1POKCKB2lPUiVs9Vol8XOmhW',
        PRICE_TEST: ''
    },
    CUSTOM_1: {
        ID: 1001,
        COUNT_LIMIT: 10_000_000,
        AI_MESSAGE_LIMIT: 100_000,
        PRICE: 'price_1POKZyB2lPUiVs9VMAY6jXTV',
        PRICE_TEST: ''
    }
}


export function getPlanFromTag(tag: PREMIUM_TAG) {
    return PREMIUM_PLAN[tag];
}

export function getPlanFromId(id: number) {
    for (const tag of PREMIUM_TAGS) {
        const plan = getPlanFromTag(tag);
        if (plan.ID === id) return plan;
    }
}

export function getPlanFromPrice(price: string, testMode: boolean) {
    for (const tag of PREMIUM_TAGS) {
        const plan = getPlanFromTag(tag);
        if (testMode) {
            if (plan.PRICE_TEST === price) return plan;
        } else {
            if (plan.PRICE === price) return plan;
        }

    }
}