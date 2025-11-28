<script setup lang="ts">

import { CircleHelp, Gamepad2, Monitor, Smartphone, Tablet, Tv } from 'lucide-vue-next';
import LineDataTemplate, { type IconProvider, type LineDataProps } from './LineDataTemplate.vue';

const props = defineProps<{ refreshToken: number, sharedLink?: string }>();

const emits = defineEmits<{
    (event: 'init', data: any): void
}>()
onMounted(() => {
    emits('init', data.value);
})

function iconProvider(e: { _id: string, count: number }): ReturnType<IconProvider> {
    if (e._id === 'desktop') return ['component', Monitor];
    if (e._id === 'tablet') return ['component', Tablet];
    if (e._id === 'mobile') return ['component', Smartphone];
    if (e._id === 'smarttv') return ['component', Tv];
    if (e._id === 'console') return ['component', Gamepad2];
    return ['component', CircleHelp]
}

const OTHERS_INFO_TOOLTIP_TEXT = 'Device -> "Others" means the device used isn’t clearly a phone, tablet, or desktop... like smart TVs, game consoles, or unknown devices.';


const { data: devices, status, refresh } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/devices', {
    headers: { 'x-limit': '10' }, lazy: true,
    transform: (data) => {
        return data.map(e => {
            if (e._id === 'mobile') return e;
            if (e._id === 'desktop') return e;
            if (e._id === 'tablet') return e;
            if (e._id === 'console') return e;
            if (e._id === 'smarttv') return e;
            return { ...e, info: OTHERS_INFO_TOOLTIP_TEXT };
        });
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
        title: 'Devices',
        sub: 'The devices most used to access your website.',
        data: devices.value ?? [],
        iconProvider,
        elementTextTransformer(text) {
            if (!text) return 'Others';
            if (text === 'mobile') return 'Mobile';
            if (text === 'desktop') return 'Desktop';
            if (text === 'tablet') return 'Tablet';
            if (text === 'console') return 'Console';
            if (text === 'smarttv') return 'Smart Tv';
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
    const data = await useAuthFetchSync<{ _id: string, count: number }[]>('/api/data/devices', { headers: { 'x-limit': '1000' } });
    showMoreDataItems.value = data;
    loading.value = false;
}

</script>

<template>
    <LineDataTemplate @show-more="showMore()" :data="data"> </LineDataTemplate>
</template>