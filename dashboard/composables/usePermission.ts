


const { data: permission } = useFetch('/api/project/members/me', {
    headers: useComputedHeaders({})
});

const canSeeWeb = computed(() => permission.value?.webAnalytics || false);
const canSeeEvents = computed(() => permission.value?.events || false);
const canSeeAi = computed(() => permission.value?.ai || false);

export function usePermission() {
    return { permission, canSeeWeb, canSeeEvents, canSeeAi };
}