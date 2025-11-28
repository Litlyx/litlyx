<script lang="ts" setup>


export type TooltipDataEventsStacked = {
    date: string,
    items: any[]
}

const props = defineProps<{ data: TooltipDataEventsStacked }>();

</script>

<template>
    <div class="z-[400] absolute pointer-events-none">

        <Card class="py-2 px-3 flex flex-col gap-2">

            <div class="flex gap-2 items-center">
                <div> Date: </div>
                <div v-if="data"> {{ data.date }}</div>
            </div>

            <div class="flex flex-col">
                <div v-for="item of props.data.items" class="flex gap-2 items-center">
                    <div class="size-3 rounded-full" :style="`background-color: ${item.color};`">
                    </div>
                    <div class="text-ellipsis truncate max-w-[75%]"> {{ item.label }} </div>
                    <div>{{ item.value }}</div>
                </div>
            </div>

        </Card>
    </div>

</template>