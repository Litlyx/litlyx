<script setup lang="ts">

import LineDataTemplate, { type IconProvider, type LineDataProps } from './LineDataTemplate.vue';

const props = defineProps<{ refreshToken: number, sharedLink?: string }>();

const emits = defineEmits<{
    (event: 'init', data: any): void
}>()
onMounted(() => {
    emits('init', data.value);
})

const NO_BROWSER_INFO_TOOLTIP_TEXT = 'Browsers -> "Others" means the visitor used a rare or unidentified browser we couldn\'t clearly classify.';

const { data: browsers, status, refresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/browsers', {
    headers: { 'x-limit': '10' }, lazy: true,
    transform: (data) => {
        return data.map(e => e._id === 'NO_BROWSER' ? { ...e, info: NO_BROWSER_INFO_TOOLTIP_TEXT } : e);
    }
});

function iconProvider(e: { _id: string, count: number }): ReturnType<IconProvider> {
    let name = e._id.toLowerCase().replace(/ /g, '-');

    if (name === 'mobile-safari') name = 'safari';
    if (name === 'chrome-headless') name = 'chrome'
    if (name === 'chrome-webview') name = 'chrome'

    return [
        'img',
        `https://github.com/alrra/browser-logos/blob/main/src/${name}/${name}_256x256.png?raw=true`
    ]
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
        title: 'Browsers',
        sub: 'The browsers most used to search your website.',
        data: browsers.value ?? [],
        iconProvider,
        iconStyle: 'width: 1.3rem; height: auto;',
        elementTextTransformer(text) {
            if (text === 'NO_BROWSER') return 'Others';
            return text;
        },
        showMoreData: {
            items: showMoreDataItems.value,
            loading: loading.value
        }
    }
})

async function showMore() {
    loading.value = true;
    const data = await useAuthFetchSync<{ _id: string, count: number }[]>('/api/data/browsers', { headers: { 'x-limit': '1000' } });
    showMoreDataItems.value = data;
    loading.value = false;
}



</script>

<template>
    <LineDataTemplate @show-more="showMore()" :data="data"> </LineDataTemplate>
</template>