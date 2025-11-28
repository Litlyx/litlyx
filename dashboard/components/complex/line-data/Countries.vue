<script setup lang="ts">

import { CircleHelp } from 'lucide-vue-next';
import LineDataTemplate, { type IconProvider, type LineDataProps } from './LineDataTemplate.vue';

const props = defineProps<{ refreshToken: number,sharedLink?: string }>();

const emits = defineEmits<{
    (event: 'init', data: any): void
}>()
onMounted(() => {
    emits('init', data.value);
})

function iconProvider(e: { _id: string, flag: string, count: number }): ReturnType<IconProvider> {
    if (!e.flag) return ['component', CircleHelp]
    return [
        'img',
        `https://raw.githubusercontent.com/hampusborgos/country-flags/refs/heads/main/svg/${e.flag.toLowerCase()}.svg`
    ]
}

const { data: countries, status, refresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/countries', {
    headers: { 'x-limit': '10' }, lazy: true,
    transform: (data) => {
        return data.map(e => ({ ...e, flag: e._id, _id: e._id ? (getCountryFromISO(e._id) ?? e._id) : 'NO_COUNTRY' }));
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
        title: 'Countries',
        sub: 'Lists the countries where users access your website.',
        data: countries.value ?? [],
        iconProvider,
        iconStyle: 'width: 1.8rem; padding: 1px;',
        showMoreData: {
            items: showMoreDataItems.value,
            loading: loading.value
        }
    }
})

async function showMore() {
    loading.value = true;
    const data = await useAuthFetchSync<{ _id: string, count: number }[]>('/api/data/countries', { headers: { 'x-limit': '1000' } });
    showMoreDataItems.value = data.map(e => ({ ...e, flag: e._id, _id: e._id ? (getCountryFromISO(e._id) ?? e._id) : 'NO_COUNTRY' }));
    loading.value = false;
}

</script>

<template>
    <LineDataTemplate @show-more="showMore()" :data="data"> </LineDataTemplate>
</template>