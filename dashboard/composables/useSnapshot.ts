import type { TProjectSnapshot } from "@schema/ProjectSnapshot";

const remoteSnapshots = useFetch<TProjectSnapshot[]>('/api/project/snapshots', {
    ...signHeaders(),
    immediate: false
});

const activeProject = useActiveProject();
watch(activeProject, async () => {
    await remoteSnapshots.refresh();
    snapshot.value = isLiveDemo() ? snapshots.value[0] : snapshots.value[1];
});

const snapshots = computed(() => {

    const activeProject = useActiveProject();

    const getDefaultSnapshots: () => TProjectSnapshot[] = () => [
        {
            project_id: activeProject.value?._id as any,
            _id: 'default0' as any,
            name: 'All',
            from: new Date(activeProject.value?.created_at || 0),
            to: new Date(Date.now()),
            color: '#CCCCCC'
        },
        {
            project_id: activeProject.value?._id as any,
            _id: 'default1' as any,
            name: 'Last month',
            from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            to: new Date(Date.now()),
            color: '#00CC00'
        },
        {
            project_id: activeProject.value?._id as any,
            _id: 'default2' as any,
            name: 'Last week',
            from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            to: new Date(Date.now()),
            color: '#0F02D2'
        },
        {
            project_id: activeProject.value?._id as any,
            _id: 'default3' as any,
            name: 'Last day',
            from: new Date(Date.now() - 1000 * 60 * 60 * 24),
            to: new Date(Date.now()),
            color: '#CC11CC'
        }
    ]

    return [
        ...getDefaultSnapshots(),
        ...(remoteSnapshots.data.value || [])
    ];
})

const snapshot = ref<TProjectSnapshot>(isLiveDemo() ? snapshots.value[0] : snapshots.value[1]);

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
    return (to - from) / (1000 * 60 * 60 * 24);
});

export function useSnapshot() {
    if (remoteSnapshots.status.value === 'idle') {
        remoteSnapshots.execute();
    }
    return { snapshot, snapshots, safeSnapshotDates, updateSnapshots, snapshotDuration }
}