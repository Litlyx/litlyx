import type { TProjectSnapshot } from "@schema/project/ProjectSnapshot";
import { getDefaultSnapshots, type GenericSnapshot } from "./snapshots/BaseSnapshots";
import * as fns from 'date-fns';

const { projectId, project } = useProject();

const headers = computed(() => {
    return {
        'Authorization': signHeaders().headers.Authorization,
        'x-pid': projectId.value ?? ''
    }
});

const remoteSnapshots = useFetch<TProjectSnapshot[]>('/api/project/snapshots', { headers });

watch(project, async () => {
    await remoteSnapshots.refresh();
    snapshot.value = isLiveDemo.value ? snapshots.value[2] : snapshots.value[2];
});

const snapshots = computed<GenericSnapshot[]>(() => {
    const defaultSnapshots: GenericSnapshot[] = project.value?._id ? getDefaultSnapshots(project.value._id as any, project.value.created_at) : [];
    return [...defaultSnapshots, ...(remoteSnapshots.data.value || [])];
})

const snapshot = ref<GenericSnapshot>(snapshots.value[1]);

const safeSnapshotDates = computed(() => {
    const from = new Date(snapshot.value?.from || 0).toISOString();
    const to = new Date(snapshot.value?.to || Date.now()).toISOString();
    return { from, to }
})

async function updateSnapshots() {
    await remoteSnapshots.refresh();
}

const snapshotDuration = computed(() => {
    const from = new Date(snapshot.value?.from || 0).getTime();
    const to = new Date(snapshot.value?.to || 0).getTime();
    return fns.differenceInDays(to, from);
});

export function useSnapshot() {
    return { snapshot, snapshots, safeSnapshotDates, updateSnapshots, snapshotDuration }
}