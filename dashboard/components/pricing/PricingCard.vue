<script lang="ts" setup>

export type PricingCardProp = {
    title: string,
    cost: string,
    features: string[],
    desc: string,
    active: boolean,
    planId: number
}

const props = defineProps<{ data: PricingCardProp }>();

const activeProject = useActiveProject();

async function onUpgradeClick() {
    const res = await $fetch<string>(`/api/pay/${activeProject.value?._id.toString()}/create`, {
        ...signHeaders({ 'content-type': 'application/json' }),
        method: 'POST',
        body: JSON.stringify({ planId: props.data.planId })
    })
    if (!res) alert('Something went wrong');
    window.open(res);
}

</script>

<template>
    <div class="p-6 bg-[#303030] rounded-xl pricing-card flex flex-col">

        <div class="flex flex-col">
            <div class="text-[1.1rem] font-semibold mb-4">
                {{ data.title }}
            </div>
            <div class="flex gap-1 items-end mb-2">
                <div class="text-[1.1rem] font-semibold">
                    €{{ data.cost }}
                </div>
                <div class="text-text-sub text-[.9rem] mb-[.15rem]">
                    per month
                </div>
            </div>
            <div v-if="data.active" class="text-[1rem] bg-[#1f1f22] rounded-md py-2 text-center">
                Current active plan
            </div>
            <div @click="onUpgradeClick()" v-if="!data.active"
                class="cursor-pointer text-[1rem] font-semibold bg-[#3a3af5] rounded-md py-2 text-center">
                Upgrade
            </div>
        </div>

        <div class="bg-gray-400 h-[1px] w-full my-4"></div>

        <div class="flex flex-col gap-1 grow">
            <div class="flex gap-2 items-center" v-for="feature of data.features">
                <i class="fas fa-check"></i>
                <div>
                    {{ feature }}
                </div>
            </div>

        </div>

        <div class="bg-gray-400 h-[1px] w-full my-4"></div>

        <div class="text-text-sub text-[.9rem] h-[20%]">
            {{ data.desc }}
        </div>
    </div>
</template>


<style scoped lang="scss">
.pricing-card * {
    font-family: "Poppins";
}
</style>