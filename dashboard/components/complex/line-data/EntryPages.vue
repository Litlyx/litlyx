<script setup lang="ts">

import LineDataTemplate, { type LineDataProps } from './LineDataTemplate.vue';

const props = defineProps<{ refreshToken: number, sharedLink?: string }>();

const emits = defineEmits<{
    (event: 'init', data: any): void
}>()
onMounted(() => {
    emits('init', data.value);
})

const { data: pages, status, refresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/entry_pages', {
    headers: { 'x-limit': '10' }, lazy: true
});

const showMoreDataItems = ref<{ _id: string, count: number }[]>([]);
const loading = ref<boolean>(true);


watch(() => props.refreshToken, async () => {
    loading.value = true;
    await refresh();        // rifà il fetch
    loading.value = false;
});

const data = computed<LineDataProps>(() => {
    return {
        loading: status.value !== 'success',
        title: 'Entry pages',
        sub: 'First page a user lands on.',
        data: pages.value ?? [],
        showMoreData: {
            items: showMoreDataItems.value,
            loading: loading.value
        },
        actionProps: { to: '/raw_visits' }
    }
})

async function showMore() {
    loading.value = true;
    const data = await useAuthFetchSync<{ _id: string, count: number }[]>('/api/data/entry_pages', { headers: { 'x-limit': '1000' } });
    showMoreDataItems.value = data;
    loading.value = false;
}

</script>

<template>
    <LineDataTemplate @show-more="showMore()" :data="data"> </LineDataTemplate>
</template>