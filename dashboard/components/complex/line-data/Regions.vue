<script setup lang="ts">

import { CircleHelp } from 'lucide-vue-next';
import LineDataTemplate, { type IconProvider, type LineDataProps } from './LineDataTemplate.vue';

const props = defineProps<{ refreshToken: number, sharedLink?: string }>();

const emits = defineEmits<{
    (event: 'init', data: any): void
}>()
onMounted(() => {
    emits('init', data.value);
})


const { data: regions, status, refresh } = useAuthFetch<{ _id: any, count: number }[]>('/api/data/regions', {
    headers: { 'x-limit': '10' }, lazy: true,
    transform: (data) => {
        return data.filter(e => e._id !== '??' && getRegionFromISO(e._id.region, e._id.country)).map(e => ({
            ...e, flag: e._id,
            _id: e._id ? (getRegionFromISO(e._id.region, e._id.country) ?? "NO_REGION") : 'NO_REGION'
        }));
    }
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
        title: 'Regions',
        sub: 'Lists the regions where users access your website.',
        data: regions.value ?? [],
        iconStyle: 'width: 1.8rem; padding: 1px;',
        showMoreData: {
            items: showMoreDataItems.value,
            loading: loading.value
        }
    }
})

async function showMore() {
    loading.value = true;
    const data = await useAuthFetchSync<{ _id: any, count: number }[]>('/api/data/regions', { headers: { 'x-limit': '1000' } });
    showMoreDataItems.value = data.filter(e => e._id !== '??' && getRegionFromISO(e._id.region, e._id.country)).map(e => ({
        ...e, flag: e._id,
        _id: e._id ? (getRegionFromISO(e._id.region, e._id.country) ?? "NO_REGION") : 'NO_REGION'
    }));
    loading.value = false;
}

</script>

<template>
    <LineDataTemplate @show-more="showMore()" :data="data"> </LineDataTemplate>
</template>