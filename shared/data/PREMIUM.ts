
export type PREMIUM_TAG = typeof PREMIUM_TAGS[number];

export const PREMIUM_TAGS = [
    'FREE', 'PLAN_1', 'PLAN_2', 'PLAN_3', 'PLAN_99'
] as const;


export type PREMIUM_DATA = {
    COUNT_LIMIT: number,
    AI_MESSAGE_LIMIT: number,
    PRICE: string,
    ID: number
}

export const PREMIUM_PLAN: Record<PREMIUM_TAG, PREMIUM_DATA> = {
    FREE: {
        ID: 0,
        COUNT_LIMIT: 3_000,
        AI_MESSAGE_LIMIT: 10,
        PRICE: 'price_1PNbHYB2lPUiVs9VZP32xglF'
    },
    PLAN_1: {
        ID: 1,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1PNZjVB2lPUiVs9VrsTbJL04'
    },
    PLAN_2: {
        ID: 2,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 5_000,
        PRICE: ''
    },
    PLAN_3: {
        ID: 3,
        COUNT_LIMIT: 2_000_000,
        AI_MESSAGE_LIMIT: 10_000,
        PRICE: ''
    },
    PLAN_99: {
        ID: 99,
        COUNT_LIMIT: 10_000_000,
        AI_MESSAGE_LIMIT: 100_000,
        PRICE: ''
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

export function getPlanFromPrice(price: string) {
    for (const tag of PREMIUM_TAGS) {
        const plan = getPlanFromTag(tag);
        if (plan.PRICE === price) return plan;
    }
}