export type PREMIUM_TAG = typeof PREMIUM_TAGS[number];

export const PREMIUM_TAGS = [
    'FREE',
    'PLAN_1',
    'PLAN_2',
    'CUSTOM_1',
    'INCUBATION',
    'ACCELERATION',
    'GROWTH',
    'EXPANSION',
    'SCALING',
    'UNICORN',
    'LIFETIME_GROWTH_ONETIME',
    'GROWTH_DUMMY',
    'APPSUMO_INCUBATION',
    'APPSUMO_ACCELERATION',
    'APPSUMO_GROWTH',
    'APPSUMO_UNICORN'
] as const;


export type PREMIUM_DATA = {
    COUNT_LIMIT: number,
    AI_MESSAGE_LIMIT: number,
    PRICE: string,
    PRICE_TEST: string,
    ID: number,
    COST: number
}

export const PREMIUM_PLAN: Record<PREMIUM_TAG, PREMIUM_DATA> = {
    FREE: {
        ID: 0,
        COUNT_LIMIT: 5_000,
        AI_MESSAGE_LIMIT: 10,
        PRICE: 'price_1POKCMB2lPUiVs9VLe3QjIHl',
        PRICE_TEST: 'price_1PNbHYB2lPUiVs9VZP32xglF',
        COST: 0
    },
    PLAN_1: {
        ID: 1,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1POKCOB2lPUiVs9VC13s2rQw',
        PRICE_TEST: 'price_1PNZjVB2lPUiVs9VrsTbJL04',
        COST: 0
    },
    PLAN_2: {
        ID: 2,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 5_000,
        PRICE: 'price_1POKCKB2lPUiVs9Vol8XOmhW',
        PRICE_TEST: 'price_1POK34B2lPUiVs9VIROb0IIV',
        COST: 0
    },
    CUSTOM_1: {
        ID: 1001,
        COUNT_LIMIT: 10_000_000,
        AI_MESSAGE_LIMIT: 100_000,
        PRICE: 'price_1POKZyB2lPUiVs9VMAY6jXTV',
        PRICE_TEST: '',
        COST: 0
    },
    INCUBATION: {
        ID: 101,
        COUNT_LIMIT: 50_000,
        AI_MESSAGE_LIMIT: 30,
        PRICE: 'price_1PdsyzB2lPUiVs9V4J246Jw0',
        PRICE_TEST: '',
        COST: 499
    },
    ACCELERATION: {
        ID: 102,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1Pdt5bB2lPUiVs9VhkuCouEt',
        PRICE_TEST: '',
        COST: 999
    },
    GROWTH: {
        ID: 103,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PdszrB2lPUiVs9VIdkT3thv',
        PRICE_TEST: '',
        COST: 2999
    },
    EXPANSION: {
        ID: 104,
        COUNT_LIMIT: 1_000_000,
        AI_MESSAGE_LIMIT: 5_000,
        PRICE: 'price_1Pdt0xB2lPUiVs9V0Rdt80Fe',
        PRICE_TEST: '',
        COST: 5999
    },
    SCALING: {
        ID: 105,
        COUNT_LIMIT: 2_500_000,
        AI_MESSAGE_LIMIT: 10_000,
        PRICE: 'price_1Pdt1UB2lPUiVs9VUmxntSwZ',
        PRICE_TEST: '',
        COST: 9999
    },
    UNICORN: {
        ID: 106,
        COUNT_LIMIT: 5_000_000,
        AI_MESSAGE_LIMIT: 20_000,
        PRICE: 'price_1Pdt2LB2lPUiVs9VGBFAIG9G',
        PRICE_TEST: '',
        COST: 14999
    },
    LIFETIME_GROWTH_ONETIME: {
        ID: 2001,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PvewGB2lPUiVs9VLheJC8s1',
        PRICE_TEST: 'price_1Pvf7LB2lPUiVs9VMFNyzpim',
        COST: 239900
    },
    GROWTH_DUMMY: {
        ID: 5001,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PvgoRB2lPUiVs9VC51YBT7J',
        PRICE_TEST: 'price_1PvgRTB2lPUiVs9V3kFSNC3G',
        COST: 0
    },
    APPSUMO_INCUBATION: {
        ID: 6001,
        COUNT_LIMIT: 50_000,
        AI_MESSAGE_LIMIT: 30,
        PRICE: 'price_1QIXwbB2lPUiVs9VKSsoksaU',
        PRICE_TEST: '',
        COST: 0
    },
    APPSUMO_ACCELERATION: {
        ID: 6002,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1QIXxRB2lPUiVs9VrjaVRoOl',
        PRICE_TEST: '',
        COST: 0
    },
    APPSUMO_GROWTH: {
        ID: 6003,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1QIXy8B2lPUiVs9VQBOUPAoE',
        PRICE_TEST: '',
        COST: 0
    },
    APPSUMO_UNICORN: {
        ID: 6006,
        COUNT_LIMIT: 5_000_000,
        AI_MESSAGE_LIMIT: 20_000,
        PRICE: 'price_1Qls1lB2lPUiVs9VI6ej8hwE',
        PRICE_TEST: '',
        COST: 0
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