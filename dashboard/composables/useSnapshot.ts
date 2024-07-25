import type { TProjectSnapshot } from "@schema/ProjectSnapshot";

const snapshots = useFetch<TProjectSnapshot[]>('/api/project/snapshots', {
    ...signHeaders(),
    immediate: false
});

const snapshot = ref<TProjectSnapshot>();

watch(snapshots.data, () => {
    if (!snapshots.data.value) return;
    snapshot.value = snapshots.data.value[0];
});

const safeSnapshotDates = computed(() => {
    const from = new Date(snapshot.value?.from || 0).toISOString();
    const to = new Date(snapshot.value?.to || Date.now()).toISOString();
    return { from, to }
})

export function useSnapshot() {
    if (snapshots.status.value === 'idle') {
        snapshots.execute();
    }
    return { snapshot, snapshots, safeSnapshotDates }
}