<script lang="ts" setup>

const props = defineProps<{ shardName: string, count: number, totalSize: number, totalIndexSize: number, chunks?: number }>();

</script>

<template>
    <div class="flex gap-2 items-center">
        <Icon name="uil:puzzle-piece" :size="20"></Icon>
        <div class="w-[8rem]">{{ shardName }}</div>

        <div class="w-[9rem] flex gap-2 items-center">
            <Icon :size="20" name="ph:files"></Icon>
            <div> {{ formatNumberK(count, 2) }} </div>
        </div>
        <div class="w-[9rem] flex gap-2 items-center">
            <Icon :size="20" name="lucide:weight"></Icon>
            <div> {{ formatBytes(totalSize, 2) }} </div>
        </div>
        <div class="w-[9rem] flex gap-2 items-center">
            <Icon :size="20" name="material-symbols:key-vertical"></Icon>
            <div> {{ formatBytes(totalIndexSize, 2) }} </div>
        </div>
        <div class="w-[9rem] flex gap-2 items-center" v-if="chunks">
            <Icon :size="20" name="fluent:puzzle-cube-piece-20-filled"></Icon>
            <div> {{ chunks }} </div>
        </div>
    </div>
</template>