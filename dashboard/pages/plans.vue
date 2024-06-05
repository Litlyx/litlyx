<script lang="ts" setup>
import dayjs from 'dayjs';

const activeProject = useActiveProject();

definePageMeta({ layout: 'dashboard' });

const { data: planData } = useFetch('/api/project/plan', signHeaders());

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
    const percent = 100 / total * left;
    return percent;
});

const prettyExpireDate = computed(() => {
    if (!planData.value) return '';
    return dayjs(planData.value.billing_expire_at).format('DD/MM/YYYY');
});


const { data: invoices } = await useFetch(`/api/pay/${activeProject.value?._id.toString()}/invoices`, signHeaders())

const showPricingDrawer = ref<boolean>(false);
function onPlanUpgradeClick() {
    showPricingDrawer.value = true;
}

function openInvoice(link: string) {
    window.open(link, '_blank');
}

</script>

<template>

    <div class="w-full h-full p-8 overflow-y-auto pb-40 lg:pb-0 relative overflow-x-hidden">

        <Transition name="pdrawer">
            <PricingDrawer class="bg-black absolute right-0 top-0 w-[60vw] min-w-[65rem] h-full z-[20]"
                v-if=showPricingDrawer>
            </PricingDrawer>
        </Transition>

        <div @click="showPricingDrawer = false" v-if="showPricingDrawer"
            class="barrier absolute left-0 top-0 w-full h-full z-[19] bg-black/40 backdrop-blur-[1px]">
        </div>

        <div class="poppins font-semibold text-[1.8rem]">
            Billing
        </div>
        <div class="poppins text-[1.3rem] text-text-sub">
            Manage your billing cycle for the project
            <span class="font-bold">
                {{ activeProject?.name || '' }}
            </span>
        </div>
        <div class="my-4 mb-10 w-full bg-gray-400/30 h-[1px]">
        </div>

        <div class="flex flex-wrap justify-start gap-8">
            <Card v-if="planData" class="px-0 pt-6 pb-4 w-[35rem] flex flex-col">
                <div class="flex flex-col gap-6 px-8 grow">
                    <div class="flex justify-between flex-col sm:flex-row">
                        <div class="flex flex-col">
                            <div class="flex gap-3 items-center">
                                <div class="poppins font-semibold text-[1.1rem]">
                                    {{ planData.premium ? 'Premium plan' : 'Basic plan' }}
                                </div>
                                <div
                                    class="flex lato text-[.7rem] bg-accent/25 border-accent/40 border-[1px] px-[.6rem] rounded-lg">
                                    {{ planData.premium ? 'PREMIUM ' + planData.premium_type : 'FREE' }}
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
                        <div class="flex items-center gap-4">
                            <div class="grow">
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
                    <div @click="onPlanUpgradeClick()"
                        class="cursor-pointer flex items-center gap-2 text-[.9rem] text-accent drop-shadow-[0_0_8px_#000000]">
                        <div class="poppins"> Upgrade plan </div>
                        <i class="fas fa-arrow-up-right"></i>
                    </div>
                </div>
            </Card>

            <Card v-if="planData" class="px-0 pt-6 pb-4 w-[35rem] flex flex-col">
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
                        <div class="flex items-center gap-4">
                            <div class="grow">
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
                <div class="my-4 w-full bg-gray-400/30 h-[1px]">
                </div>
                <div class="flex justify-end px-8 flex-col sm:flex-row">
                    <div @click="onPlanUpgradeClick()"
                        class="cursor-pointer flex items-center gap-2 text-[.9rem] text-accent drop-shadow-[0_0_8px_#000000]">
                        <div class="poppins"> Upgrade plan </div>
                        <i class="fas fa-arrow-up-right"></i>
                    </div>
                </div>
            </Card>
        </div>


        <CardTitled title="Invoices" :sub="(invoices && invoices.length == 0) ? 'No invoices yet' : ''"
            class="p-4 mt-8 max-w-[72rem]">

            <div class="flex flex-col gap-2">

                <div class="flex gap-10 bg-black p-4 rounded-lg" v-for="invoice of invoices">

                    <div> <i class="far fa-file-invoice"></i> </div>

                    <div> {{ new Date(invoice.date).toLocaleString() }} </div>
                    <div> € {{ invoice.cost / 100 }} </div>
                    <div> {{ invoice.id }} </div>
                    <div
                        class="flex items-center lato text-[.8rem] bg-accent/25 border-accent/40 border-[1px] px-[.6rem] rounded-lg">
                        {{ invoice.status }}
                    </div>
                    <div>
                        <i @click="openInvoice(invoice.link)"
                            class="far fa-download cursor-pointer hover:text-white/80"></i>
                    </div>
                </div>

            </div>

        </CardTitled>


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
