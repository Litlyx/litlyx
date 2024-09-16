<script lang="ts" setup>

type Props = {
    options: { label: string }[],
    currentIndex: number
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (evt: 'changeIndex', newIndex: number): void;
}>();

</script>


<template>

    <div class="flex gap-2 border-[1px] border-lyx-widget-lighter p-1 md:p-2 rounded-xl bg-lyx-widget">
        <div @click="$emit('changeIndex', index)" v-for="(opt, index) of options"
            class="hover:bg-lyx-widget-lighter/60 select-btn-animated cursor-pointer rounded-lg poppins font-regular px-2 md:px-3 py-1 text-[.8rem] md:text-[1rem]"
            :class="{ 'bg-lyx-widget-lighter hover:!bg-lyx-widget-lighter': currentIndex == index }">
            {{ opt.label }}
        </div>
    </div>

</template>


<style scoped lang="scss">
.select-btn-animated {
    transition: all .4s linear;
}
</style>