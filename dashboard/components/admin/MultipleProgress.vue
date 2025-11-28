<script lang="ts" setup>

const props = defineProps<{ items: { value: number, color: string }[] }>();

function getPercent(index: number) {
    const total = props.items.reduce((a, e) => a + e.value, 0);
    const percent = 100 / total * props.items[index].value;
    return Math.ceil(percent);
}

</script>

<template>
    <div class="flex rounded-md overflow-hidden">
        <div :style="`width: ${getPercent(index)}%; background-color: ${props.items[index].color};`"
            v-for="(item, index) of props.items">
        </div>
    </div>
</template>