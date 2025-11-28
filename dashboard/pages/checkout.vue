<script lang="ts" setup>

import { type PLAN_DATA } from '@data/PLANS';


definePageMeta({ layout: 'sidebar' });

const { getPlanUsingPrice } = usePremiumStore();

const route = useRoute();

const preview = ref<any>();

const new_plan_data = ref<PLAN_DATA>();

onMounted(async () => {
    const res = await useAuthFetchSync(`/api/payments/preview_upgrade?plan_tag=${route.query.plan_tag}`);
    preview.value = res;
    new_plan_data.value = getPlanUsingPrice(res.lines.data[1].pricing.price_details.price);
});

const upgrading = ref<boolean>(false);

async function confirmUpgrade() {
    upgrading.value = true;
    await useCatch({
        toast: true,
        toastTitle: 'Error during upgrade',
        async action() {
            return await useAuthFetchSync(`/api/payments/upgrade?plan_tag=${route.query.plan_tag}`);
        },
        onSuccess(data, showToast) {
            showToast('Payment confirmed', { description: 'Payment confirmed' })
            setTimeout(() => {
                location.href = '/billing';
            }, 1000)
        },
        onGenericError(ex: any) {
            upgrading.value = false;
        },
    });

}

</script>

<template>
    <div class="flex justify-center">

        <Loader class="mt-[20vh]" v-if="!preview || !new_plan_data"></Loader>

        <div class="max-w-[50rem] w-full flex flex-col gap-4 mt-10" v-else>
            <Card class="poppins">
                <CardContent>
                    <div>
                        <div class="flex justify-between items-center">
                            <div class="font-bold text-xl">
                                Upgrade to {{ new_plan_data.NAME }}
                            </div>
                            <div>
                                <NuxtLink to="/plans">
                                    <Button variant="secondary" size="sm"> Cancel </Button>
                                </NuxtLink>
                            </div>
                        </div>
                        <Separator class="my-4"></Separator>
                        <div class="flex justify-between">
                            <div>
                                <div class="text-secondary-foreground font-medium">
                                    {{ new_plan_data.NAME }} Plan
                                </div>
                                <div class="text-muted-foreground">
                                    €{{ new_plan_data.COST / 100 }} per
                                    {{ new_plan_data.TAG.endsWith('ANNUAL') ? 'year' : 'month' }}
                                    billed
                                    {{ new_plan_data.TAG.endsWith('ANNUAL') ? 'yearly' : 'monthly' }}
                                </div>
                            </div>
                            <div>
                                €{{ new_plan_data.COST / 100 }}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card class="poppins">
                <CardContent>
                    <div>
                        <div class="flex flex-col gap-2">
                            <div class="text-secondary-foreground">
                                Summary
                            </div>
                            <div class="text-muted-foreground">
                                Your plan will renew on {{ new Date(preview.period_end * 1000).toLocaleDateString() }}
                            </div>
                        </div>
                        <Separator class="my-4"></Separator>
                        <div class="flex justify-between">
                            <div class="flex flex-col gap-2">
                                <div class="text-secondary-foreground">
                                    Proration
                                </div>
                                <div class="text-muted-foreground w-[70%]">
                                    We deduct what you already paid for whithin the current plan, plus the unused period
                                    between the start of this billing cycle and now.
                                </div>
                            </div>
                            <div class="shrink-0">
                                -€{{ -preview.lines.data[0].amount / 100 }}
                            </div>
                        </div>
                        <Separator class="my-4"></Separator>
                        <div class="flex justify-between">
                            <div class="flex flex-col gap-2">
                                <div class="text-secondary-foreground">
                                    Subtotal
                                </div>
                                <div class="text-secondary-foreground">
                                    VAT
                                </div>
                            </div>
                            <div class="flex flex-col gap-2 text-right">
                                <div class="text-secondary-foreground">
                                    €{{ (preview.total / 100) }}
                                </div>
                                <div class="text-secondary-foreground">
                                    €0.00
                                </div>
                            </div>
                        </div>
                        <Separator class="my-4"></Separator>
                        <div class="flex justify-between">
                            <div class="text-secondary-foreground">
                                Pay now
                            </div>
                            <div class="text-secondary-foreground">
                                €{{ (preview.total / 100) }}
                            </div>
                        </div>
                        <Button :disabled="upgrading" @click="confirmUpgrade()"
                            class="w-full mt-10 !text-white !bg-[#7537F3]">
                            <span v-if="upgrading">
                                <Loader class="!size-4"></Loader>
                            </span>
                            <span v-else>Confirm & Pay</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>