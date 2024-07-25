<script lang="ts" setup>

const props = defineProps<{
    icon: string,
    value: string,
    text: string,
    avg?: string,
    trend?: number,
    color: string,
    data?: number[],
    labels?: string[],
    ready?: boolean
}>();

</script>

<template>

    <Card class="flex flex-col overflow-hidden relative max-h-[12rem] aspect-[2/1] w-full">
        <div v-if="ready" class="flex p-4 items-start">
            <div class="flex items-center mt-2 mr-4">
                <i :style="`color: ${props.color}`" :class="icon" class="text-[1.6rem] 2xl:text-[2rem]"></i>
            </div>
            <div class="flex flex-col grow">
                <div class="flex items-end gap-2">
                    <div class="brockmann text-text-dirty text-[1.6rem] 2xl:text-[1.9rem]"> {{ value }} </div>
                    <div class="poppins text-text-sub text-[.7rem] 2xl:text-[.85rem] mb-2"> {{ avg }} </div>
                </div>
                <div class="poppins text-text-sub text-[.9rem] 2xl:text-base"> {{ text }} </div>
            </div>
            <div v-if="trend" class="flex flex-col items-center gap-1">
                <div class="flex items-center gap-3 rounded-xl px-2 py-1" :style="`background-color: ${props.color}33`">
                    <i :class="trend > 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'"
                        class="far text-[.9rem] 2xl:text-[1rem]" :style="`color: ${props.color}`"></i>
                    <div :style="`color: ${props.color}`" class="font-semibold text-[.75rem] 2xl:text-[.875rem]">
                        {{ trend.toFixed(0) }} %
                    </div>
                </div>
                <div class="poppins text-text-sub text-[.7rem]"> Daily variation </div>
            </div>

        </div>
        <div class="absolute bottom-0 left-0 w-full h-[50%] flex items-end" v-if="((props.data?.length || 0) > 0) && ready">
            <DashboardEmbedChartCard v-if="ready" :data="props.data || []" :labels="props.labels || []"
                :color="props.color">
            </DashboardEmbedChartCard>
        </div>
    </Card>

    <!-- <div class="bg-menu p-4 rounded-xl flex flex-col gap-2 w-full lg:w-[20rem] relative pb-2 lg:pb-4">

        <div class="gap-4 flex flex-row items-center lg:items-start lg:gap-2 lg:flex-col">
            <div class="w-[2.5rem] h-[2.5rem] lg:w-[3.5rem] lg:h-[3.5rem] flex items-center justify-center rounded-lg"
                :style="`background: ${props.color}`">
                <i :class="icon" class="text-[1rem] lg:text-[1.5rem]"></i>
            </div>
            <div class="text-[1rem] lg:text-[1.3rem] text-text-sub/90 poppins">
                {{ title }}
            </div>
        </div>
        <div class="flex gap-2 items-center lg:items-end">
            <div class="brockmann text-text text-[2rem] lg:text-[2.8rem] grow">
                {{ text }}
            </div>
            <div class="poppins text-text-sub/90 text-[.9rem] lg:text-[1rem]"> {{ sub }} </div>
        </div>


    </div> -->

</template>