<script setup lang="ts">

import LineDataTemplate, { type LineDataProps } from './LineDataTemplate.vue';

const { data: events,status,refresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/events', {
    headers: { 'x-limit': '9' }, lazy: true
});

const emits = defineEmits<{
    (event: 'init', data: any): void
}>()
onMounted(() => {
    emits('init', data.value);
})

const showMoreDataItems = ref<{ _id: string, count: number }[]>([]);
const loading = ref<boolean>(true);

const props = defineProps<{ refreshToken: number }>();
watch(() => props.refreshToken, async () => {
    loading.value = true;
    await refresh();        // rifà il fetch
    loading.value = false;
});

const data = computed<LineDataProps>(() => {
    return {
        loading: status.value !== 'success',
        title: 'Top events',
        sub: 'Most frequent user events triggered in this project.',
        data: events.value ?? [],
        showMoreData: {
            items: showMoreDataItems.value,
            loading: loading.value
        },
        actionProps: { to: '/raw_events' }
    }
})

async function showMore() {
    loading.value = true;
    const data = await useAuthFetchSync<{ _id: string, count: number }[]>('/api/data/events', { headers: { 'x-limit': '1000' } });
    showMoreDataItems.value = data;
    loading.value = false;
}

</script>

<template>
    <LineDataTemplate @show-more="showMore()" :data="data"> </LineDataTemplate>
</template>