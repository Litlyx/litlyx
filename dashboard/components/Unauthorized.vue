<script lang="ts" setup>
const props = defineProps<{
    authorization: string
}>()
</script>

<template>
    <div class="flex flex-col items-center gap-4 mt-[10vh]">
        <div class="w-[10rem]">
            <img class="w-full" :src="'/sticker_sad.png'" alt="Litlyx Sticker Sad">
        </div>
        <div class="poppins text-[1.2rem]"> Contact the project owner to get access to this section. </div>
        <div class="poppins text-[.9rem] text-muted-foreground"> Missing authorization: {{ props.authorization }} </div>
    </div>
</template>