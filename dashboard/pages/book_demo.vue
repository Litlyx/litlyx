<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

const iframecal = ref<any | undefined>(null);

const loaded = ref<boolean>(false);

onMounted(() => {
    loaded.value = false;
    if (!iframecal.value) return;
    iframecal.value.onload = () => {
        loaded.value = true;
    }

});
</script>

<template>

    <div class="w-full h-full bg-[#101010]">
        <iframe v-show="loaded" ref="iframecal" class="w-full h-full" src="https://cal.com/litlyx/30min">
        </iframe>
        <div class="w-full h-full flex gap-2 justify-center items-center poppins font-bold text-[1.6rem]" v-if="!loaded">
            <div class="animate-pulse"> Loading... </div>
        </div>
    </div>

</template>