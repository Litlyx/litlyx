<script lang="ts" setup>


export type PricingCardProp = {
    title: string,
    price: string,
    subs: string[],
    features: string[],
    cta: string,
    link?: string
}

const props = defineProps<{ datas: PricingCardProp[] }>();

const currentIndex = ref<number>(0);

const data = computed(() => {
    return props.datas[currentIndex.value];
})


</script>


<template>
    <div class="bg-[#151515] outline outline-[1px] outline-[#262626] py-8 px-10 rounded-lg w-full max-w-[30rem]">

        <div class="flex flex-col gap-3 text-center">
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
            <div class="poppins" v-for="sub of data.subs"> {{ sub }} </div>
        </div>

        <div class="sep bg-[#262626] h-[1px] my-8"></div>

        <div class="flex flex-col gap-2">
            <div class="flex gap-2" v-for="feature of data.features">
                <div class="h-6 w-6">
                    <img class="w-full h-full" :src="'check.png'" alt="Check">
                </div>
                <div>{{ feature }}</div>
            </div>
        </div>

        <div class="mt-10 flex">
            <MainButton :link="data.link || 'https://dashboard.litlyx.com'"
                class="w-full !rounded-md text-center text-[.9rem] !py-2">
                {{ data.cta }}
            </MainButton>
        </div>

    </div>
</template>