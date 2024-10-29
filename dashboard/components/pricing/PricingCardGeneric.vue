<script lang="ts" setup>


export type PricingCardProp = {
    title: string,
    price: string,
    subs: string[],
    features: string[],
    cta: string,
    link?: string,
    isDowngrade: boolean,
    active: boolean,
    planId: number
}

const props = defineProps<{ datas: PricingCardProp[], defaultIndex?: number }>();

const { project } = useProject();

const currentIndex = ref<number>(props.defaultIndex || 0);

const data = computed(() => {
    return props.datas[currentIndex.value];
})

async function onUpgradeClick() {
    const res = await $fetch<string>(`/api/pay/create`, {
        headers: useComputedHeaders({
            useSnapshotDates: false,
            custom: {
                'content-type': 'application/json'
            }
        }).value,
        method: 'POST',
        body: JSON.stringify({ planId: data.value.planId })
    })
    if (!res) alert('Something went wrong');
    window.open(res);
}

</script>


<template>
    <div
        class="relative bg-[#151515] outline outline-[1px] outline-[#262626] py-8 px-10 rounded-lg w-full max-w-[30rem]">

        <div class="flex flex-col gap-3 text-center pt-3">
            <div v-if="data.active"
                class="absolute right-6 top-3 poppins text-[.75rem] bg-transparent border-[#262626] border-solid border-[1px] px-3 py-[.1rem] rounded-sm">
                Active
            </div>
            <div v-if="!data.active && data.title === 'Growth'"
                class="absolute right-6 top-3 poppins text-[.75rem] bg-[#fbbe244f] outline outline-[1px] outline-[#fbbf24] px-3 py-[.1rem] rounded-sm">
                Most popular
            </div>
            <div class="poppins text-xl font-light"> {{ data.title }} </div>
            <div class="poppins text-4xl font-medium"> {{ data.price }} </div>
        </div>

        <div class="sep bg-[#262626] h-[1px] my-8"></div>

        <div class="flex flex-col text-center h-[6rem] justify-center gap-2">
            <div v-if="datas.length > 1">
                <URange :ui="{
                    thumb: {
                        color: 'text-[#5680f8]'
                    },
                    progress: {
                        background: '!bg-[#5680f8]'
                    }
                }" :min="0" :max="datas.length - 1" v-model="currentIndex">
                </URange>
            </div>
            <div :class="{ '!text-[.8rem] !text-lyx-text-darker': sub.includes('€') }" class="poppins text-[.9rem]"
                v-for="sub of data.subs">
                {{ sub }}
            </div>
        </div>

        <div class="sep bg-[#262626] h-[1px] my-8"></div>

        <div class="flex flex-col gap-2">
            <div class="flex gap-2" v-for="feature of data.features">
                <div class="h-6 w-6">
                    <img class="w-full h-full" :src="'/check.png'" alt="Check">
                </div>
                <div>{{ feature }}</div>
            </div>
        </div>

        <div class="mt-10 flex">

            <div class="w-full flex" v-if="data.planId > -1">


                <LyxUiButton class="rounded-md py-2 w-full text-center" type="primary" @click="onUpgradeClick()"
                    v-if="!data.active && !data.isDowngrade">
                    Upgrade
                </LyxUiButton>

                <LyxUiButton class="rounded-md py-2 w-full text-center" type="danger" @click="onUpgradeClick()"
                    v-if="!data.active && data.isDowngrade">
                    Downgrade
                </LyxUiButton>

            </div>

            <LyxUiButton v-if="data.planId === -1" :to="data.link || 'https://dashboard.litlyx.com'"
                class="rounded-md py-2 w-full text-center" type="primary">
                {{ data.cta }}
            </LyxUiButton>

        </div>

    </div>
</template>