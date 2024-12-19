<script lang="ts" setup>

const emits = defineEmits<{ (evt: 'onCloseClick'): void }>();

const { drawerComponent } = useDrawer();

</script>

<template>
    <div class="p-8 overflow-y-auto">

        <div @click="$emit('onCloseClick')"
            class="cursor-pointer fixed top-4 right-4 rounded-full bg-menu drop-shadow-[0_0_2px_#CCCCCCCC] w-9 h-9 flex items-center justify-center">
            <i class="fas fa-close text-[1.6rem]"></i>
        </div>

        <Component v-if="drawerComponent" :is="drawerComponent"></Component>

    </div>
</template>