<script lang="ts" setup>
import dayjs from 'dayjs';
import type { SettingsTemplateEntry } from './Template.vue';

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

const showPricingDrawer = ref<boolean>(false);
function onPlanUpgradeClick() {
    showPricingDrawer.value = true;
}

function openInvoice(link: string) {
    window.open(link, '_blank');
}

function getPremiumName(type: number) {
    if (type === 0) return 'FREE';
    if (type === 1) return 'ACCELERATION';
    if (type === 2) return 'EXPANSION';
    return 'CUSTOM';

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


</script>

<template>
    <div class="relative">

        <Transition name="pdrawer">
            <PricingDrawer @onCloseClick="showPricingDrawer = false" :currentSub="planData?.premium_type || 0"
                class="bg-black fixed right-0 top-0 w-full xl:w-[60vw] xl:min-w-[65rem] h-full z-[20]"
                v-if=showPricingDrawer>
            </PricingDrawer>
        </Transition>

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
                                <div class="poppins font-semibold text-[2rem]"> $0 </div>
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
                        <div v-if="!isGuest" @click="onPlanUpgradeClick()"
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
