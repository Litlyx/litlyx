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

const router = useRouter();
function onPlanUpgradeClick() {
    router.push('/book_demo');
}
</script>

<template>

    <div class="w-full h-full p-8 overflow-y-auto pb-40 lg:pb-0">

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


        <CardTitled title="Invoices" sub="No invoices yet" class="p-4 mt-8 max-w-[72rem]">
        </CardTitled>
    </div>

</template>
