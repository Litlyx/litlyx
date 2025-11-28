
import type { TUserPlanInfo } from "~/server/api/user/plan";
import { getPlanFromId, type PLAN_DATA } from '@data/PLANS';
import { getPlanFromPrice } from '~/shared/data/PLANS';

export const usePremiumStore = defineStore('premium', () => {

    const plan = shallowRef<TUserPlanInfo>();
    const planPending = ref<boolean>(false);

    async function fetchPremium() {
        plan.value = undefined;
        planPending.value = true;
        await nextTick();
        const res = await useAuthFetchSync<TUserPlanInfo>('/api/user/plan');
        plan.value = res;
        planPending.value = false;
    }

    const billingPeriodPercent = computed(() => {
        if (!plan.value) return 0;
        const start = plan.value.start_at;
        const end = plan.value.end_at;
        const duration = end - start;
        const remaining = end - Date.now();
        const percent = 100 - Math.floor(100 / duration * remaining);
        return percent;
    });

    const planInfo = computed<PLAN_DATA | undefined>(() => {
        if (!plan.value) return;
        return getPlanFromId(plan.value.premium_type);
    });

    const isAnnual = computed(() => {
        return planInfo.value?.TAG.endsWith('_ANNUAL');
    })

    const isCanceled = computed(() => {
        return plan.value?.canceled;
    })

    function getPlanUsingPrice(price: string) {
        const price_live = getPlanFromPrice(price, false);
        if (!price_live) {
            const price_test = getPlanFromPrice(price, true);
            return price_test;
        }
        return price_live;
    }

    return {
        fetchPremium,
        plan,
        planPending,
        billingPeriodPercent,
        planInfo,
        isAnnual,
        isCanceled,
        getPlanUsingPrice
    }

})