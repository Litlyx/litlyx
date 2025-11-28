<script lang="ts" setup>


export type TooltipData = {
    visits: number,
    events: number,
    sessions: number,
    date: string
}

const props = defineProps<{ data: any }>();
const colors = useChartColor();

</script>

<template>
    <div class="z-[400] absolute pointer-events-none transition-all duration-300">

        <Card class="py-2 px-3 flex flex-col gap-2 !border-violet-500/20">

            <div class="flex gap-2 items-center">
                <div> Date: </div>
                <div v-if="data"> {{ data.date }}</div>
            </div>

            <div class="flex flex-col gap-2">
                <div class="flex gap-2 items-center bg-muted dark:bg-muted/20 px-2 py-1 rounded">
                    <div class="size-3 rounded-full" :style="`background-color: ${colors.visits};`">
                    </div>
                    <div> Visits: </div>
                    <div class="text-muted-foreground">{{ props.data.visits }}</div>
                </div>
                <div class="flex gap-2 items-center bg-muted dark:bg-muted/20 px-2 py-1 rounded">
                    <div class="size-3 rounded-full" :style="`background-color: ${colors.sessions};`">
                    </div>
                    <div> Unique Visitors: </div>
                    <div class="text-muted-foreground">{{ props.data.sessions }}</div>
                </div>
                <div class="flex gap-2 items-center bg-muted dark:bg-muted/20 px-2 py-1 rounded">
                    <div class="size-3 rounded-full" :style="`background-color: yellow;`">
                    </div>
                    <div> Events: </div>
                    <div class="text-muted-foreground">{{ props.data.events }}</div>
                </div>
            </div>
        </Card>
    </div>

</template>