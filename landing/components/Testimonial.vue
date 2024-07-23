<script lang="ts" setup>

const props = defineProps<{
    name: string,
    sub: string,
    linkText: string,
    link: string,
    text: string
}>();

</script>

<template>
    <LyxUiCard>
        <div class="flex flex-col gap-4">
            <div>
                <div>{{ name }}</div>
                <div>{{ sub }} <NuxtLink class="text-lyx-primary" :to="link" target="_blank">{{ linkText }}</NuxtLink>
                </div>
            </div>
            <div>
                {{ text }}
            </div>
        </div>
    </LyxUiCard>
</template>