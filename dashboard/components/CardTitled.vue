<script lang="ts" setup>

const props = defineProps<{ title: string, sub?: string }>();

</script>

<template>
    <LyxUiCard>
        <div class="flex flex-col gap-4 h-full">
            <div class="flex items-center">
                <div class="flex flex-col grow">
                    <div class="poppins font-semibold text-[1rem] md:text-[1.3rem] text-text">
                        {{ props.title }}
                    </div>
                    <div v-if="props.sub" class="poppins text-[.7rem] md:text-[1rem] text-text-sub">
                        {{ props.sub }}
                    </div>
                </div>
                <slot name="header"></slot>
            </div>
            <div class="h-full">
                <slot></slot>
            </div>
        </div>
    </LyxUiCard>
</template>