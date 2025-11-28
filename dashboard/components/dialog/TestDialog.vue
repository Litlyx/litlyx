<script lang="ts" setup>

const emits = defineEmits<{
    (event: 'confirm', data: number): void
}>()

const props = defineProps<{ data: { contentText: string } }>();

</script>

<template>
    <div>
        TEST DIALOG CONTENT
        <Button @click="emits('confirm', 123)">
            {{ data.contentText }}
        </Button>
    </div>
</template>