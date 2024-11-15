import type { TProjectSnapshot } from "@schema/ProjectSnapshot";

import fns from 'date-fns';

const { projectId, project } = useProject();

const headers = computed(() => {
    return {
        'Authorization': signHeaders().headers.Authorization,
        'x-pid': projectId.value ?? ''
    }
});
const remoteSnapshots = useFetch<TProjectSnapshot[]>('/api/project/snapshots', {
    headers
});

watch(project, async () => {
    await remoteSnapshots.refresh();
    snapshot.value = isLiveDemo.value ? snapshots.value[0] : snapshots.value[1];
});

const snapshots = computed(() => {

    const getDefaultSnapshots: () => TProjectSnapshot[] = () => [
        {
            project_id: project.value?._id as any,
            _id: 'default0' as any,
            name: 'All',
            from: new Date(project.value?.created_at || 0),
            to: new Date(Date.now()),
            color: '#CCCCCC'
        },
        {
            project_id: project.value?._id as any,
            _id: 'current_month' as any,
            name: 'Current month',
            from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            to: new Date(Date.now()),
            color: '#00CC00'
        },
        {
            project_id: project.value?._id as any,
            _id: 'default2' as any,
            name: 'Last week',
            from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            to: new Date(Date.now()),
            color: '#0F02D2'
        },
        {
            project_id: project.value?._id as any,
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

const snapshot = ref<TProjectSnapshot>(isLiveDemo.value ? snapshots.value[0] : snapshots.value[1]);

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
    return { snapshot, snapshots, safeSnapshotDates, updateSnapshots, snapshotDuration }
}