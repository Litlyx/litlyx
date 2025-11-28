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


const { data: continents, status, refresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/continents', {
    headers: { 'x-limit': '10' }, lazy: true,
    transform: (data) => {
        return data.filter(e => e._id !== '??').map(e => ({ ...e, flag: e._id, _id: e._id ? (getContinentFromISO(e._id) ?? e._id) : 'NO_CONTINENT' }));
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
        title: 'Continents',
        sub: 'Lists the continents where users access your website.',
        data: continents.value ?? [],
        iconStyle: 'width: 1.8rem; padding: 1px;',
        showMoreData: {
            items: showMoreDataItems.value,
            loading: loading.value
        }
    }
})

async function showMore() {
    loading.value = true;
    const data = await useAuthFetchSync<{ _id: string, count: number }[]>('/api/data/continents', { headers: { 'x-limit': '1000' } });
    showMoreDataItems.value = data.filter(e => e._id !== '??').map(e => ({ ...e, flag: e._id, _id: e._id ? (getContinentFromISO(e._id) ?? e._id) : 'NO_CONTINENT' }));
    loading.value = false;
}

</script>

<template>
    <LineDataTemplate @show-more="showMore()" :data="data"> </LineDataTemplate>
</template>