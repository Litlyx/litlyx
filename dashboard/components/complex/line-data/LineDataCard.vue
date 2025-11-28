<script lang="ts" setup>
export type LineDataCardProps = {
    title: string,
    sub: string,
    action?: Component,
    actionProps?: Record<string, any>
}

const props = defineProps<{ data: LineDataCardProps }>();

const emits = defineEmits<{
    (event: 'showMore'): void
}>();
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>
                {{ data.title }}
            </CardTitle>
            <CardDescription>
                {{ data.sub }}
            </CardDescription>
            <CardAction v-if="data.action" class="flex items-center">
                 <component :data="data.actionProps" :is="data.action"></component> 
            </CardAction>
        </CardHeader>
        <CardContent class="h-full">
            <slot></slot>
        </CardContent>
    </Card>
</template>