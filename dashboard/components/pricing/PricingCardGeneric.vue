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

const props = defineProps<{ datas: PricingCardProp[] }>();

const activeProject = useActiveProject();

const currentIndex = ref<number>(0);

const data = computed(() => {
    return props.datas[currentIndex.value];
})

async function onUpgradeClick() {
    const res = await $fetch<string>(`/api/pay/${activeProject.value?._id.toString()}/create`, {
        ...signHeaders({ 'content-type': 'application/json' }),
        method: 'POST',
        body: JSON.stringify({ planId: data.value.planId })
    })
    if (!res) alert('Something went wrong');
    window.open(res);
}

</script>


<template>
    <div class="relative bg-[#151515] outline outline-[1px] outline-[#262626] py-8 px-10 rounded-lg w-full max-w-[30rem]">

        <div class="flex flex-col gap-3 text-center">
            <div class="poppins text-xl font-light"> {{ data.title }} </div>
            <div v-if="data.active" class="absolute right-6 top-3 poppins text-[.75rem] bg-[#222A42] outline outline-[1px] outline-[#5680F8] px-3 py-[.1rem] rounded-xl">
                Active
            </div>
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
                    <img class="w-full h-full" :src="'/check.png'" alt="Check">
                </div>
                <div>{{ feature }}</div>
            </div>
        </div>

        <div class="mt-10 flex">
            <div class="w-full" v-if="data.planId > -1">
                <div @click="onUpgradeClick()" v-if="!data.active && !data.isDowngrade"
                    class="cursor-pointer text-[1rem] font-semibold bg-[#3a3af5] rounded-md py-2 text-center">
                    Upgrade
                </div>
                <div @click="onUpgradeClick()" v-if="!data.active && data.isDowngrade"
                    class="w-full cursor-pointer text-[1rem] font-semibold bg-[#1f1f22] text-red-400 rounded-md py-2 text-center">
                    Downgrade
                </div>
            </div>
            <NuxtLink v-if="data.planId === -1" :to="data.link || 'https://dashboard.litlyx.com'"
                class="bg-[#222A42] cursor-pointer outline outline-[1px] outline-[#5680F8] w-full !rounded-md text-center text-[.9rem] !py-2 ">
                {{ data.cta }}
            </NuxtLink>
        </div>

    </div>
</template>