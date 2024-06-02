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

    <div class="flex gap-2 border-[1px] border-gray-400 px-2 py-2 rounded-xl">
        <div @click="$emit('changeIndex', index)" v-for="(opt, index) of options"
            class="hover:bg-white/10 select-btn-animated cursor-pointer px-3 py-1 rounded-lg poppins font-semibold"
            :class="{
                'bg-accent hover:!bg-accent': currentIndex == index,
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