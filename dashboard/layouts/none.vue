<script setup lang="ts">
const { showDialog, closeDialog } = useBarCardDialog();

</script>


<template>
    <div class="w-full h-full">
        <div v-if="showDialog" class="barrier w-full h-full z-[34] absolute bg-black/50 backdrop-blur-[2px]">
            <i class="z-[40] absolute right-12 top-8 fas fa-times text-text-sub text-[1.8rem] lg:text-[3rem]"></i>
        </div>
        <div @click="closeDialog()" class="w-full h-full z-[35] absolute top-0 left-0 px-4 lg:px-60 py-20"
            v-if="showDialog">
            <DashboardDialogBarCard @click.stop="null" class="z-[36]"></DashboardDialogBarCard>
        </div>
        <slot></slot>
    </div>

</template>

<style scoped lang="scss"></style>
