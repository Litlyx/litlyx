<script lang="ts" setup>

defineProps<{ operation: any }>();

</script>

<template>
    <Card>
        <CardContent class="flex items-center gap-2">
            <div class="size-3 bg-gray-300 rounded-full"></div>
            <div class="w-[20rem]"> {{ operation.shard }} </div>
            <div class="w-[20rem]"> {{ operation.ns }} </div>
            <div class="w-[10rem]"> {{ formatTime(operation.totalOperationTimeElapsedSecs * 1000) }} </div>
            <div class> {{ operation.donorState ?? 'NO_STATE' }} </div>
        </CardContent>
    </Card>
</template>