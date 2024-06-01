

export function isLiveDemo() {
    const route = useRoute();
    return route.path == '/live_demo';
}

export function useLiveDemo() {
    return useFetch('/api/live_demo', {
        key: 'live_demo_project'
    });
}

