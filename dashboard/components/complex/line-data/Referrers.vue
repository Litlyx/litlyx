<script setup lang="ts">

import { Link } from 'lucide-vue-next';
import LineDataTemplate, { type IconProvider, type LineDataProps } from './LineDataTemplate.vue';
import SelectRefer from './selectors/SelectRefer.vue';

const props = defineProps<{ refreshToken: number, sharedLink?: string }>();

const emits = defineEmits<{
    (event: 'init', data: any): void
}>()
onMounted(() => {
    emits('init', data.value);
})

const SELF_INFO_TOOLTIP_TEXT = '"Self" means the visitor came to your site directly, without any referrer (like from typing the URL, a bookmark, or a QR code).';

const { data: referrers, status, refresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/referrers', {
    headers: {
        'x-limit': '10'
    }, lazy: true,
    transform: (data) => {
        return data.map(e => e._id === 'self' ? { ...e, info: SELF_INFO_TOOLTIP_TEXT } : e);
    }
});



function iconProvider(e: { _id: string, count: number }): ReturnType<IconProvider> {
    if (e._id === 'self') return ['component', Link];
    return ['img', `https://s2.googleusercontent.com/s2/favicons?domain=${e._id}&sz=64`]
}

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
        title: 'Referrers',
        sub: 'Where users find your website.',
        data: referrers.value ?? [],
        //action:SelectRefer,
        iconProvider,
        iconStyle: 'width: 1.3rem; height: auto;',
        hasLink: true,
        showMoreData: {
            items: showMoreDataItems.value,
            loading: loading.value
        }
    }
})

async function showMore() {
    loading.value = true;
    const data = await useAuthFetchSync<{ _id: string, count: number }[]>('/api/data/referrers', {
        headers: {
            'x-limit': '1000'
        }
    });
    showMoreDataItems.value = data;
    loading.value = false;
}

</script>

<template>
    <LineDataTemplate @show-more="showMore()" :data="data"> </LineDataTemplate>
</template>