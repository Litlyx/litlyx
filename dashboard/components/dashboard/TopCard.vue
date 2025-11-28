<script lang="ts" setup>

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LoaderCircle, Info, type LucideIcon } from 'lucide-vue-next'

export type TopCardData = {
    icon: LucideIcon,
    value: string,
    text: string,
    textSecondary?: string,
    sub: string,
    color: string,
    tooltip: string,
    ready: boolean,
    chart_data: number[],
    chart_labels: string[],
    todayIndex: number
}

const props = defineProps<{ data: TopCardData }>();

</script>

<template>

    <Card class="flex !p-0 flex-col overflow-hidden relative w-full h-[10rem] xl:h-[8rem] 2xl:h-[10rem]">
        <div v-if="data.ready" class="flex p-4 items-start">
            <div class="flex items-center mt-2 mr-4">
                <component :style="`color: ${data.color};`" class="w-6 h-6" :is="data.icon"></component>
            </div>
            <div class="flex flex-col grow">
                <div class="flex md:items-center flex-col md:flex-row md:gap-2">
                    <div class="poppins text-primary text-[1.2rem] xl:text-[1rem] 2xl:text-[1.3rem]">
                        {{ data.value }}
                    </div>
                    <div class="poppins text-lyx-text-sub text-[.65rem] 2xl:text-[.75rem]">
                        {{ data.sub }}
                    </div>
                </div>
                <div class="poppins text-lyx-text-sub text-[.9rem] xl:text-[.8rem] 2xl:text-[.95rem]">
                    {{ data.text }} <span v-if="data.textSecondary">{{ data.textSecondary }}</span>
                </div>
            </div>

            <div class=" flex-col items-center gap-1 hidden md:flex">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info class="size-4 text-lyx-text-sub"></Info>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{{ data.tooltip }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

        </div>
        <div class="absolute bottom-0 left-0 w-full h-[50%] flex items-end" v-if="data.ready">
            <DashboardTopChart v-if="data.ready" :todayIndex="data.todayIndex" :data="data.chart_data"
                :labels="data.chart_labels" :color="data.color">
            </DashboardTopChart>
        </div>
        <div v-if="!data.ready" class="flex justify-center items-center w-full h-full flex-col gap-2">
            <LoaderCircle class="animate-[spin_1s_ease-in-out_infinite] duration-500"></LoaderCircle>
        </div>
    </Card>


</template>