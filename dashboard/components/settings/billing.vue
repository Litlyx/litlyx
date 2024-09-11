<script lang="ts" setup>
import dayjs from 'dayjs';
import type { SettingsTemplateEntry } from './Template.vue';
import { getPlanFromId, PREMIUM_PLAN, type PREMIUM_TAG } from '@data/PREMIUM';

const activeProject = useActiveProject();

definePageMeta({ layout: 'dashboard' });

const { data: planData, refresh: planRefresh, pending: planPending } = useFetch('/api/project/plan', {
    ...signHeaders(),
    lazy: true
});

const percent = computed(() => {
    if (!planData.value) return '-';
    return (100 / planData.value.limit * planData.value.count).toFixed(2) + '%';
});

const color = computed(() => {
    if (!planData.value) return 'blue';
    if (planData.value.count >= planData.value.limit) return 'red';
    return 'blue';
});

const daysLeft = computed(() => {
    if (!planData.value) return '-';
    return (-dayjs().diff(planData.value.billing_expire_at, 'days')).toString();
});

const leftPercent = computed(() => {
    if (!planData.value) return 0;
    const left = dayjs().diff(planData.value.billing_expire_at, 'days');
    const total = dayjs(planData.value.billing_start_at).diff(planData.value.billing_expire_at, 'days');
    const percent = 100 - (100 / total * left);
    return percent;
});

const prettyExpireDate = computed(() => {
    if (!planData.value) return '';
    return dayjs(planData.value.billing_expire_at).format('DD/MM/YYYY');
});


const { data: invoices, refresh: invoicesRefresh, pending: invoicesPending } = useFetch(`/api/pay/${activeProject.value?._id.toString()}/invoices`, {
    ...signHeaders(),
    lazy: true
})

function openInvoice(link: string) {
    window.open(link, '_blank');
}

function getPremiumName(type: number) {

    return Object.keys(PREMIUM_PLAN).map(e => ({
        ...PREMIUM_PLAN[e as PREMIUM_TAG], name: e
    })).find(e => e.ID == type)?.name;

}

function getPremiumPrice(type: number) {
    const PLAN = getPlanFromId(type);
    if (!PLAN) return '0,00';
    return (PLAN.COST / 100).toFixed(2).replace('.', ',')
}


watch(activeProject, () => {
    invoicesRefresh();
    planRefresh();
})


const entries: SettingsTemplateEntry[] = [
    { id: 'plan', title: 'Current plan', text: 'Manage current plat for this project' },
    { id: 'usage', title: 'Usage', text: 'Show usage of current project' },
    { id: 'invoices', title: 'Invoices', text: 'Manage invoices of current project' },
]


const { visible } = usePricingDrawer();

</script>

<template>
    <div class="relative">

        <div v-if="invoicesPending || planPending"
            class="backdrop-blur-[1px] z-[20] mt-20 w-full h-full flex items-center justify-center font-bold">
            <i class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
        </div>

        <SettingsTemplate v-if="!invoicesPending && !planPending" :entries="entries">
            <template #plan>
                <LyxUiCard v-if="planData" class="flex flex-col w-full">
                    <div class="flex flex-col gap-6 px-8 grow">
                        <div class="flex justify-between flex-col sm:flex-row">
                            <div class="flex flex-col">
                                <div class="flex gap-3 items-center">
                                    <div class="poppins font-semibold text-[1.1rem]">
                                        {{ planData.premium ? 'Premium plan' : 'Basic plan' }}
                                    </div>
                                    <div
                                        class="flex lato text-[.7rem] bg-accent/25 border-accent/40 border-[1px] px-[.6rem] rounded-lg">
                                        {{ planData.premium ? getPremiumName(planData.premium_type) : 'FREE' }}
                                    </div>
                                </div>
                                <div class="poppins text-text-sub text-[.9rem]">
                                    Our free plan for testing the product.
                                </div>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="poppins font-semibold text-[2rem]"> €
                                    {{ getPremiumPrice(planData.premium_type) }} </div>
                                <div class="poppins text-text-sub mt-2"> per month </div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="poppins"> Billing period:</div>
                            <div class="flex items-center gap-2 md:gap-4 flex-col pt-4 md:pt-0 md:flex-row">
                                <div class="grow w-full md:w-auto">
                                    <UProgress color="green" :min="0" :max="100" :value="leftPercent"></UProgress>
                                </div>
                                <div class="poppins"> {{ daysLeft }} days left </div>
                            </div>
                            <div class="flex justify-center">
                                Subscription: {{ planData.subscription_status }}
                            </div>
                        </div>
                    </div>
                    <div class="my-4 w-full bg-gray-400/30 h-[1px]">
                    </div>
                    <div class="flex justify-between px-8 flex-col sm:flex-row">
                        <div class="flex gap-2 text-text-sub text-[.9rem]">
                            <div class="poppins"> Expire date:</div>
                            <div> {{ prettyExpireDate }}</div>
                        </div>
                        <div v-if="!isGuest" @click="visible = true"
                            class="cursor-pointer flex items-center gap-2 text-[.9rem] text-white font-semibold bg-accent px-4 py-1 rounded-lg drop-shadow-[0_0_8px_#000000]">
                            <div class="poppins"> Upgrade plan </div>
                            <i class="fas fa-arrow-up-right"></i>
                        </div>
                    </div>
                </LyxUiCard>
            </template>
            <template #usage>
                <LyxUiCard v-if="planData" class="flex flex-col w-full">
                    <div class="flex flex-col gap-6 px-8">
                        <div class="flex justify-between">
                            <div class="flex flex-col">
                                <div class="poppins font-semibold text-[1.1rem]">
                                    Usage
                                </div>
                                <div class="poppins text-text-sub text-[.9rem]">
                                    Check the usage limits of your project.
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="poppins"> Usage:</div>
                            <div class="flex items-center gap-2 md:gap-4 flex-col pt-4 md:pt-0 md:flex-row">
                                <div class="grow w-full md:w-auto">
                                    <UProgress :color="color" :min="0" :max="planData.limit" :value="planData.count">
                                    </UProgress>
                                </div>
                                <div class="poppins"> {{ percent }}</div>
                            </div>
                            <div class="flex justify-center">
                                {{ formatNumberK(planData.count) }} / {{ formatNumberK(planData.limit) }}
                            </div>
                        </div>
                    </div>
                </LyxUiCard>
            </template>
            <template #invoices>

                <CardTitled v-if="!isGuest" title="Invoices"
                    :sub="(invoices && invoices.length == 0) ? 'No invoices yet' : ''" class="p-4 mt-8 w-full">

                    <div class="flex flex-col gap-2">

                        <div class="flex justify-between items-center bg-[#161616] p-4 rounded-lg"
                            v-for="invoice of invoices">

                            <div> <i class="fal fa-file-invoice"></i> </div>

                            <div class="flex flex-col md:flex-row md:justify-around md:grow items-center gap-2">
                                <div> {{ new Date(invoice.date).toLocaleString() }} </div>
                                <div> € {{ invoice.cost / 100 }} </div>
                                <div> {{ invoice.id }} </div>
                                <div
                                    class="flex items-center lato text-[.8rem] bg-accent/25 border-accent/40 border-[1px] px-[.6rem] rounded-lg">
                                    {{ invoice.status }}
                                </div>
                            </div>

                            <div>
                                <i @click="openInvoice(invoice.link)"
                                    class="far fa-download cursor-pointer hover:text-white/80"></i>
                            </div>
                        </div>

                    </div>

                </CardTitled>
            </template>
        </SettingsTemplate>
    </div>


</template>

<style scoped lang="scss">
.pdrawer-enter-active,
.pdrawer-leave-active {
    transition: all .5s ease-in-out;
}

.pdrawer-enter-from,
.pdrawer-leave-to {
    transform: translateX(100%)
}

.pdrawer-enter-to,
.pdrawer-leave-from {
    transform: translateX(0)
}
</style>
