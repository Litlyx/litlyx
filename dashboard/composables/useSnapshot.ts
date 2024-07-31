import type { TProjectSnapshot } from "@schema/ProjectSnapshot";

const remoteSnapshots = useFetch<TProjectSnapshot[]>('/api/project/snapshots', {
    ...signHeaders(),
    immediate: false
});

const activeProject = useActiveProject();
watch(activeProject, () => {
    remoteSnapshots.refresh();
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

const snapshot = ref<TProjectSnapshot>(snapshots.value[1]);

// watch(remoteSnapshots.data, () => {
//     if (!remoteSnapshots.data.value) return;
//     snapshot.value = remoteSnapshots.data.value[0];
// });

const safeSnapshotDates = computed(() => {
    const from = new Date(snapshot.value?.from || 0).toISOString();
    const to = new Date(snapshot.value?.to || Date.now()).toISOString();
    return { from, to }
})

function updateSnapshots() {
    remoteSnapshots.refresh();
}

export function useSnapshot() {
    if (remoteSnapshots.status.value === 'idle') {
        remoteSnapshots.execute();
    }
    return { snapshot, snapshots, safeSnapshotDates, updateSnapshots }
}