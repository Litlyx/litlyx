import { CustomPremiumPriceModel } from "../schema/CustomPremiumPriceSchema";

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
    'GROWTH_DUMMY'
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
        COUNT_LIMIT: 5_000,
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
        PRICE_TEST: 'price_1POK34B2lPUiVs9VIROb0IIV'
    },
    CUSTOM_1: {
        ID: 1001,
        COUNT_LIMIT: 10_000_000,
        AI_MESSAGE_LIMIT: 100_000,
        PRICE: 'price_1POKZyB2lPUiVs9VMAY6jXTV',
        PRICE_TEST: ''
    },
    INCUBATION: {
        ID: 101,
        COUNT_LIMIT: 50_000,
        AI_MESSAGE_LIMIT: 30,
        PRICE: 'price_1PdsyzB2lPUiVs9V4J246Jw0',
        PRICE_TEST: ''
    },
    ACCELERATION: {
        ID: 102,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1Pdt5bB2lPUiVs9VhkuCouEt',
        PRICE_TEST: ''
    },
    GROWTH: {
        ID: 103,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PdszrB2lPUiVs9VIdkT3thv',
        PRICE_TEST: ''
    },
    EXPANSION: {
        ID: 104,
        COUNT_LIMIT: 1_000_000,
        AI_MESSAGE_LIMIT: 5_000,
        PRICE: 'price_1Pdt0xB2lPUiVs9V0Rdt80Fe',
        PRICE_TEST: ''
    },
    SCALING: {
        ID: 105,
        COUNT_LIMIT: 2_500_000,
        AI_MESSAGE_LIMIT: 10_000,
        PRICE: 'price_1Pdt1UB2lPUiVs9VUmxntSwZ',
        PRICE_TEST: ''
    },
    UNICORN: {
        ID: 106,
        COUNT_LIMIT: 5_000_000,
        AI_MESSAGE_LIMIT: 20_000,
        PRICE: 'price_1Pdt2LB2lPUiVs9VGBFAIG9G',
        PRICE_TEST: ''
    },
    LIFETIME_GROWTH_ONETIME: {
        ID: 2001,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PvewGB2lPUiVs9VLheJC8s1',
        PRICE_TEST: 'price_1Pvf7LB2lPUiVs9VMFNyzpim'
    },
    GROWTH_DUMMY: {
        ID: 5001,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PvgoRB2lPUiVs9VC51YBT7J',
        PRICE_TEST: 'price_1PvgRTB2lPUiVs9V3kFSNC3G'     
    }
}

CustomPremiumPriceModel.find({}).then(custom_prices => {
    for (const custom_price of custom_prices) {
        PREMIUM_PLAN[custom_price.tag] = {
            ID: custom_price.price_id,
            COUNT_LIMIT: custom_price.count_limit,
            AI_MESSAGE_LIMIT: custom_price.ai_message_limit,
            PRICE: custom_price.price,
            PRICE_TEST: custom_price.price_test || ''
        }
    }
});


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