export type PLAN_TAG = typeof PLAN_TAGS[number];

export const PLAN_TAGS = [
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
    'APPSUMO_EXPANSION',
    'APPSUMO_UNICORN',

    'FREE_TRIAL_LITLYX_PRO',
    'FREE_TRIAL_ENDED',

    "MINI_ANNUAL",
    "MINI_MONTHLY",
    "BASIC_ANNUAL",
    "BASIC_MONTHLY",
    "PRO_ANNUAL",
    "PRO_MONTHLY",
    "LAUNCH_ANNUAL",
    "LAUNCH_MONTHLY",
    "SCALE_ANNUAL",
    "SCALE_MONTHLY",

    "SELFHOSTED_FREE",
    "SELFHOSTED_PRO"
] as const;


export type PLAN_DATA = {
    COUNT_LIMIT: number,
    AI_MESSAGE_LIMIT: number,
    PRICE: string,
    PRICE_TEST: string,
    ID: number,
    COST: number,
    NAME: string,
    TAG: PLAN_TAG,
    features: {
        workspaces: number,
        members: number,
        data_retention: number,
        public_shareable_links: boolean,
        private_shareable_links: boolean,
        customizable_report: boolean
    }
}

export type STRICT_PLAN_DATA<T extends PLAN_TAG> = {
    COUNT_LIMIT: number,
    AI_MESSAGE_LIMIT: number,
    PRICE: string,
    PRICE_TEST: string,
    ID: number,
    COST: number,
    NAME: string,
    TAG: T,
    features: {
        workspaces: number,
        members: number,
        data_retention: number,
        public_shareable_links: boolean,
        private_shareable_links: boolean,
        customizable_report: boolean
    }
}

export type PLAN_DATA_MAP = {
    [k in PLAN_TAG]: STRICT_PLAN_DATA<k>
}

export const PREMIUM_PLAN: PLAN_DATA_MAP = {
    FREE: {
        ID: 0,
        COUNT_LIMIT: 5_000,
        AI_MESSAGE_LIMIT: 10,
        PRICE: 'price_1POKCMB2lPUiVs9VLe3QjIHl',
        PRICE_TEST: 'price_1PNbHYB2lPUiVs9VZP32xglF',
        COST: 0,
        TAG: 'FREE',
        NAME: 'FREE',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    PLAN_1: {
        ID: 1,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1POKCOB2lPUiVs9VC13s2rQw',
        PRICE_TEST: 'price_1PNZjVB2lPUiVs9VrsTbJL04',
        COST: 0,
        TAG: 'PLAN_1',
        NAME: 'PLAN_1',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    PLAN_2: {
        ID: 2,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 5_000,
        PRICE: 'price_1POKCKB2lPUiVs9Vol8XOmhW',
        PRICE_TEST: 'price_1POK34B2lPUiVs9VIROb0IIV',
        COST: 0,
        TAG: 'PLAN_2',
        NAME: 'PLAN_2',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    CUSTOM_1: {
        ID: 1001,
        COUNT_LIMIT: 10_000_000,
        AI_MESSAGE_LIMIT: 100_000,
        PRICE: 'price_1POKZyB2lPUiVs9VMAY6jXTV',
        PRICE_TEST: '',
        COST: 0,
        TAG: 'CUSTOM_1',
        NAME: 'CUSTOM_1',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    INCUBATION: {
        ID: 101,
        COUNT_LIMIT: 50_000,
        AI_MESSAGE_LIMIT: 30,
        PRICE: 'price_1PdsyzB2lPUiVs9V4J246Jw0',
        PRICE_TEST: '',
        COST: 499,
        TAG: 'INCUBATION',
        NAME: 'Incubation',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    ACCELERATION: {
        ID: 102,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1Pdt5bB2lPUiVs9VhkuCouEt',
        PRICE_TEST: '',
        COST: 999,
        TAG: 'ACCELERATION',
        NAME: 'Acceleration',
        features: {
            workspaces: 10,
            members: 5,
            data_retention: 4 * 12,
            public_shareable_links: true,
            private_shareable_links: false,
            customizable_report: true
        }
    },
    GROWTH: {
        ID: 103,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PdszrB2lPUiVs9VIdkT3thv',
        PRICE_TEST: '',
        COST: 2999,
        TAG: 'GROWTH',
        NAME: 'Growth',
        features: {
            workspaces: 25,
            members: 8,
            data_retention: 5 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },
    EXPANSION: {
        ID: 104,
        COUNT_LIMIT: 1_000_000,
        AI_MESSAGE_LIMIT: 5_000,
        PRICE: 'price_1Pdt0xB2lPUiVs9V0Rdt80Fe',
        PRICE_TEST: '',
        COST: 5999,
        TAG: 'EXPANSION',
        NAME: 'Expansion',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    SCALING: {
        ID: 105,
        COUNT_LIMIT: 2_500_000,
        AI_MESSAGE_LIMIT: 10_000,
        PRICE: 'price_1Pdt1UB2lPUiVs9VUmxntSwZ',
        PRICE_TEST: '',
        COST: 9999,
        TAG: 'SCALING',
        NAME: 'SCALING',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    UNICORN: {
        ID: 106,
        COUNT_LIMIT: 5_000_000,
        AI_MESSAGE_LIMIT: 20_000,
        PRICE: 'price_1Pdt2LB2lPUiVs9VGBFAIG9G',
        PRICE_TEST: '',
        COST: 14999,
        TAG: 'UNICORN',
        NAME: 'Unicorn',
        features: {
            workspaces: 999,
            members: 999,
            data_retention: 10 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },
    LIFETIME_GROWTH_ONETIME: {
        ID: 2001,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PvewGB2lPUiVs9VLheJC8s1',
        PRICE_TEST: 'price_1Pvf7LB2lPUiVs9VMFNyzpim',
        COST: 239900,
        TAG: 'LIFETIME_GROWTH_ONETIME',
        NAME: 'LIFETIME_GROWTH_ONETIME',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    GROWTH_DUMMY: {
        ID: 5001,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1PvgoRB2lPUiVs9VC51YBT7J',
        PRICE_TEST: 'price_1PvgRTB2lPUiVs9V3kFSNC3G',
        COST: 0,
        TAG: 'GROWTH_DUMMY',
        NAME: 'GROWTH_DUMMY',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    APPSUMO_INCUBATION: {
        ID: 6001,
        COUNT_LIMIT: 50_000,
        AI_MESSAGE_LIMIT: 30,
        PRICE: 'price_1QIXwbB2lPUiVs9VKSsoksaU',
        PRICE_TEST: 'price_1RBIUsB2lPUiVs9VojGan6WH',
        COST: 0,
        TAG: 'APPSUMO_INCUBATION',
        NAME: 'Appsumo Incubation',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    APPSUMO_ACCELERATION: {
        ID: 6002,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 100,
        PRICE: 'price_1QIXxRB2lPUiVs9VrjaVRoOl',
        PRICE_TEST: 'price_1RBIV5B2lPUiVs9VKQyxvhst',
        COST: 0,
        TAG: 'APPSUMO_ACCELERATION',
        NAME: 'Appsumo Acceleration',
        features: {
            workspaces: 10,
            members: 5,
            data_retention: 4 * 12,
            public_shareable_links: true,
            private_shareable_links: false,
            customizable_report: true
        }
    },
    APPSUMO_GROWTH: {
        ID: 6003,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 3_000,
        PRICE: 'price_1QIXy8B2lPUiVs9VQBOUPAoE',
        PRICE_TEST: 'price_1RBIVFB2lPUiVs9VsMoldAu3',
        COST: 0,
        TAG: 'APPSUMO_GROWTH',
        NAME: 'Appsumo Growth',
        features: {
            workspaces: 25,
            members: 8,
            data_retention: 5 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },
    APPSUMO_EXPANSION: {
        ID: 6004,
        COUNT_LIMIT: 1_000_000,
        AI_MESSAGE_LIMIT: 20_000,
        PRICE: 'price_1RHm4uB2lPUiVs9VTxZRr61B',
        PRICE_TEST: '',
        COST: 0,
        TAG: 'APPSUMO_EXPANSION',
        NAME: 'Appsumo Expansion',
        features: {
            workspaces: 999,
            members: 10,
            data_retention: 6 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },
    APPSUMO_UNICORN: {
        ID: 6006,
        COUNT_LIMIT: 5_000_000,
        AI_MESSAGE_LIMIT: 20_000,
        PRICE: 'price_1Qls1lB2lPUiVs9VI6ej8hwE',
        PRICE_TEST: '',
        COST: 0,
        TAG: 'APPSUMO_UNICORN',
        NAME: 'Appsumo Unicorn',
        features: {
            workspaces: 999,
            members: 999,
            data_retention: 10 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },

    FREE_TRIAL_LITLYX_PRO: {
        ID: 7006,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 20_000,
        PRICE: 'price_1RjJNYB2lPUiVs9Vc6m3NJg0',
        PRICE_TEST: 'price_1RYoQdB2lPUiVs9V6rU9oYOD',
        COST: 0,
        TAG: 'FREE_TRIAL_LITLYX_PRO',
        NAME: 'Free trial (Mini)',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    FREE_TRIAL_ENDED: {
        ID: 7999,
        COUNT_LIMIT: 0,
        AI_MESSAGE_LIMIT: 0,
        PRICE: 'price_1RjJNeB2lPUiVs9VVHWvuy4B',
        PRICE_TEST: 'price_1RYogBB2lPUiVs9VjGWO1YIm',
        COST: 0,
        TAG: 'FREE_TRIAL_ENDED',
        NAME: 'Free trial ended',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },

    MINI_MONTHLY: {
        ID: 8001,
        COUNT_LIMIT: 10_000,
        AI_MESSAGE_LIMIT: 200,
        PRICE: 'price_1RjJNkB2lPUiVs9VaxakNtFO',
        PRICE_TEST: 'price_1RZXiZB2lPUiVs9V5imugokM',
        COST: 599,
        TAG: 'MINI_MONTHLY',
        NAME: 'Mini',
        features: {
            workspaces: 1,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    MINI_ANNUAL: {
        ID: 8002,
        COUNT_LIMIT: 10_000,
        AI_MESSAGE_LIMIT: 200,
        PRICE: 'price_1RjJNiB2lPUiVs9VUxXto69m',
        PRICE_TEST: 'price_1RZXesB2lPUiVs9VaF9NSyYm',
        COST: 5988,
        TAG: 'MINI_ANNUAL',
        NAME: 'Mini',
        features: {
            workspaces: 1,
            members: 0,
            data_retention: 2 * 12,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    BASIC_MONTHLY: {
        ID: 8003,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1RjJNpB2lPUiVs9VGeyTnznc',
        PRICE_TEST: 'price_1RZXnIB2lPUiVs9VQWj8jbvo',
        COST: 1799,
        TAG: 'BASIC_MONTHLY',
        NAME: 'Basic',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 3 * 12,
            public_shareable_links: true,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    BASIC_ANNUAL: {
        ID: 8004,
        COUNT_LIMIT: 150_000,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1RjJNoB2lPUiVs9VQRWOZBRA',
        PRICE_TEST: 'price_1RZXlaB2lPUiVs9VvffoSMMm',
        COST: 17988,
        TAG: 'BASIC_ANNUAL',
        NAME: 'Basic',
        features: {
            workspaces: 2,
            members: 0,
            data_retention: 3 * 12,
            public_shareable_links: true,
            private_shareable_links: false,
            customizable_report: false
        }
    },
    PRO_MONTHLY: {
        ID: 8005,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1RjJNuB2lPUiVs9VUIbOIUA0',
        PRICE_TEST: 'price_1RZXpSB2lPUiVs9VIM1vwl7y',
        COST: 3799,
        TAG: 'PRO_MONTHLY',
        NAME: 'Pro',
        features: {
            workspaces: 3,
            members: 0,
            data_retention: 5 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: false
        }
    },
    PRO_ANNUAL: {
        ID: 8006,
        COUNT_LIMIT: 500_000,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1RjJNsB2lPUiVs9V9Ml5ldi4',
        PRICE_TEST: 'price_1RZXokB2lPUiVs9V3aknwpBv',
        COST: 35988,
        TAG: 'PRO_ANNUAL',
        NAME: 'Pro',
        features: {
            workspaces: 3,
            members: 0,
            data_retention: 5 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: false
        }
    },
    LAUNCH_MONTHLY: {
        ID: 8007,
        COUNT_LIMIT: 2_000_000,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1RjJNyB2lPUiVs9VJT2lvDVT',
        PRICE_TEST: 'price_1RZXr6B2lPUiVs9VCabwCOmJ',
        COST: 6799,
        TAG: 'LAUNCH_MONTHLY',
        NAME: 'Launch',
        features: {
            workspaces: 10,
            members: 3,
            data_retention: 6 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },
    LAUNCH_ANNUAL: {
        ID: 8008,
        COUNT_LIMIT: 2_000_000,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1RjJNwB2lPUiVs9VbJdPI9me',
        PRICE_TEST: 'price_1RZXqPB2lPUiVs9VAfJTyMtW',
        COST: 71988,
        TAG: 'LAUNCH_ANNUAL',
        NAME: 'Launch',
        features: {
            workspaces: 10,
            members: 3,
            data_retention: 6 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },
    SCALE_MONTHLY: {
        ID: 8009,
        COUNT_LIMIT: 5_000_000,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1RjJO1B2lPUiVs9VQxAyYdtl',
        PRICE_TEST: 'price_1RZXt4B2lPUiVs9VX9uCVXGC',
        COST: 9799,
        TAG: 'SCALE_MONTHLY',
        NAME: 'Scale',
        features: {
            workspaces: 25,
            members: 999,
            data_retention: 10 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },
    SCALE_ANNUAL: {
        ID: 8010,
        COUNT_LIMIT: 5_000_000,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1RjJNzB2lPUiVs9Vti52Wquo',
        PRICE_TEST: 'price_1RZXsJB2lPUiVs9VqPhR9neO',
        COST: 107900,
        TAG: 'SCALE_ANNUAL',
        NAME: 'Scale',
        features: {
            workspaces: 25,
            members: 999,
            data_retention: 10 * 12,
            public_shareable_links: true,
            private_shareable_links: true,
            customizable_report: true
        }
    },


    SELFHOSTED_FREE: {
        ID: 9998,
        COUNT_LIMIT: 99_999_999_9999,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: '',
        PRICE_TEST: '',
        COST: 0,
        TAG: 'SELFHOSTED_FREE',
        NAME: 'Selfhosted free',
        features: {
            workspaces: 1,
            members: 0,
            data_retention: 0,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: true
        }
    },
    SELFHOSTED_PRO: {
        ID: 9999,
        COUNT_LIMIT: 99_999_999_9999,
        AI_MESSAGE_LIMIT: 999_999,
        PRICE: 'price_1SUSOtB2lPUiVs9VLHTTz1iA',
        PRICE_TEST: 'price_1SWzVYB2lPUiVs9VqNsodCGg',
        COST: 9900,
        TAG: 'SELFHOSTED_PRO',
        NAME: 'Selfhosted Pro',
        features: {
            workspaces: 25,
            members: 5,
            data_retention: 0,
            public_shareable_links: false,
            private_shareable_links: false,
            customizable_report: true
        }
    }


}

export function getPlanFromTag(tag: PLAN_TAG): PLAN_DATA | undefined {
    return PREMIUM_PLAN[tag];
}

export function getPlanFromId(id: number): PLAN_DATA | undefined {
    for (const tag of PLAN_TAGS) {
        const plan = getPlanFromTag(tag);
        if (!plan) return;
        if (plan.ID === id) return plan;
    }
}

export function getPlanFromPrice(price: string, testMode: boolean): PLAN_DATA | undefined {
    for (const tag of PLAN_TAGS) {
        const plan = getPlanFromTag(tag);
        if (!plan) return;
        if (testMode) {
            if (plan.PRICE_TEST === price) return plan;
        } else {
            if (plan.PRICE === price) return plan;
        }

    }
}