

const route = useRoute();
export const isLiveDemo = computed(() => {
    return route.path == '/live_demo';
})

const liveDemoData = useFetch('/api/live_demo');

export function useLiveDemo() { return liveDemoData; }

