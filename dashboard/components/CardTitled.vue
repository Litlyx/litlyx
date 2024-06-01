<script lang="ts" setup>

const props = defineProps<{ title: string, sub?: string }>();

</script>

<template>
    <Card>
        <div class="flex flex-col gap-4">
            <div class="flex items-center">
                <div class="flex flex-col grow">
                    <div class="poppins font-semibold text-[1.1rem] md:text-[1.4rem] text-text">
                        {{ props.title }}
                    </div>
                    <div v-if="props.sub" class="poppins text-[.8rem] md:text-[1.1rem] text-text-sub">
                        {{ props.sub }}
                    </div>
                </div>
                <slot name="header"></slot>
            </div>
            <div>

                <slot></slot>
            </div>
        </div>
    </Card>
</template>