
import type { TProjectSnapshot } from "~/shared/schema/project/ProjectSnapshot";
import * as fns from 'date-fns';

export type DefaultSnapshot = Omit<TProjectSnapshot, 'project_id'> & { default: true }
export type GenericSnapshot = TProjectSnapshot | DefaultSnapshot;

function getDefaultSnapshots(project_created_at: Date | string) {

    const today: DefaultSnapshot = {
        _id: '___today' as any,
        name: 'Today',
        from: fns.startOfDay(Date.now()),
        to: fns.endOfDay(Date.now()),
        color: '#FFA600',
        default: true
    }

    const lastDay: DefaultSnapshot = {
        _id: '___lastDay' as any,
        name: 'Yesterday',
        from: fns.startOfDay(fns.subDays(Date.now(), 1)),
        to: fns.endOfDay(fns.subDays(Date.now(), 1)),
        color: '#FF8531',
        default: true
    }


    const lastMonth: DefaultSnapshot = {
        _id: '___lastMonth' as any,
        name: 'Last Month',
        from: fns.startOfMonth(fns.subMonths(Date.now(), 1)),
        to: fns.endOfMonth(fns.subMonths(Date.now(), 1)),
        color: '#BC5090',
        default: true
    }
    const currentMonth: DefaultSnapshot = {
        _id: '___currentMonth' as any,
        name: 'Current Month',
        from: fns.startOfMonth(Date.now()),
        to: fns.endOfMonth(Date.now()),
        color: '#58508D',
        default: true
    }


    const lastWeek: DefaultSnapshot = {
        _id: '___lastWeek' as any,
        name: 'Last Week',
        from: fns.startOfWeek(fns.subWeeks(Date.now(), 1)),
        to: fns.endOfWeek(fns.subWeeks(Date.now(), 1)),
        color: '#3E909D',
        default: true
    }


    const currentWeek: DefaultSnapshot = {
        _id: '___currentWeek' as any,
        name: 'Current Week',
        from: fns.startOfWeek(Date.now()),
        to: fns.endOfWeek(Date.now()),
        color: '#007896',
        default: true
    }


    const allTime: DefaultSnapshot = {
        _id: '___allTime' as any,
        name: 'All Time',
        from: fns.addMinutes(
            fns.startOfMonth(new Date(project_created_at.toString())),
            -new Date().getTimezoneOffset()
        ),
        to: fns.addMilliseconds(fns.endOfDay(Date.now()), 1),
        color: '#9362FF',
        default: true
    }


    const last30Days: DefaultSnapshot = {
        _id: '___last30days' as any,
        name: 'Last 30 days',
        from: fns.startOfDay(fns.subDays(Date.now(), 30)),
        to: fns.endOfDay(fns.subDays(Date.now(), 0)),
        color: '#606c38',
        default: true
    }

    const last60Days: DefaultSnapshot = {
        _id: '___last60days' as any,
        name: 'Last 60 days',
        from: fns.startOfDay(fns.subDays(Date.now(), 60)),
        to: fns.endOfDay(fns.subDays(Date.now(), 0)),
        color: '#bc6c25',
        default: true
    }

    const last90Days: DefaultSnapshot = {
        _id: '___last90days' as any,
        name: 'Last 90 days',
        from: fns.startOfDay(fns.subDays(Date.now(), 90)),
        to: fns.endOfDay(fns.subDays(Date.now(), 0)),
        color: '#fefae0',
        default: true
    }


    const snapshotList = [
        allTime,
        lastDay, today,
        lastWeek, currentWeek,
        lastMonth, currentMonth,
        last30Days,
        last60Days, last90Days,
    ]

    return snapshotList;

}

export const useSnapshotStore = defineStore('snapshot', () => {

    const snapshots = shallowRef<GenericSnapshot[]>([]);
    const activeSnapshot = shallowRef<GenericSnapshot>();

    async function fetchSnapshots(options?: { activateLast: boolean }) {
        snapshots.value = [];
        activeSnapshot.value = undefined;
        await nextTick();
        const res = await useAuthFetchSync<TProjectSnapshot[]>('/api/snapshot/list');
        snapshots.value = [
            ...getDefaultSnapshots(new Date(2024, 1, 1)),
            ...res
        ];
        if (options?.activateLast) {
            activeSnapshot.value = snapshots.value.at(-1);
        } else {
            activeSnapshot.value = snapshots.value[7];
        }
    }

    function setActive(snapshot_id: string) {
        activeSnapshot.value = snapshots.value.find(e => snapshot_id === e._id.toString());
    }

    const from = computed(() => {
        if (!activeSnapshot.value) return;
        return new Date(activeSnapshot.value.from).getTime()
    });
    const to = computed(() => {
        if (!activeSnapshot.value) return;
        return new Date(activeSnapshot.value.to).getTime()
    });

    const duration = computed(() => {
        if (!activeSnapshot.value) return 0;
        const from = new Date(activeSnapshot.value.from).getTime();
        const to = new Date(activeSnapshot.value.to).getTime() + 1000;
        return fns.differenceInDays(to, from);
    });

    return {
        snapshots,
        activeSnapshot,
        fetchSnapshots,
        setActive,
        duration,
        from, to
    }
})