<script lang="ts" setup>

type Props = {
    options: { label: string, disabled?: boolean }[],
    currentIndex: number
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (evt: 'changeIndex', newIndex: number): void;
}>();

</script>


<template>

    <div class="flex gap-2 border-[1px] p-1 md:p-2 rounded-xl bg-lyx-lightmode-widget-light border-lyx-lightmode-widget dark:bg-lyx-widget dark:border-lyx-widget-lighter">
        <div @click="opt.disabled ? ()=>{}: $emit('changeIndex', index)" v-for="(opt, index) of options"
            class="hover:bg-lyx-lightmode-widget dark:hover:bg-lyx-widget-lighter/60 select-btn-animated cursor-pointer rounded-lg poppins font-regular px-2 md:px-3 py-1 text-[.8rem] md:text-[1rem]"
            :class="{
                'bg-lyx-lightmode-widget hover:!bg-lyx-lightmode-widget dark:bg-lyx-widget-lighter dark:hover:!bg-lyx-widget-lighter': currentIndex == index && !opt.disabled,
                'hover:!bg-lyx-lightmode-widget-light text-lyx-lightmode-widget dark:hover:!bg-lyx-widget !cursor-not-allowed dark:!text-lyx-widget-lighter': opt.disabled
            }">
            {{ opt.label }}
        </div>
    </div>

</template>


<style scoped lang="scss">
.select-btn-animated {
    transition: all .4s linear;
}
</style>