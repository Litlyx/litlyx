
import type { TProjectSnapshot } from "@schema/project/ProjectSnapshot";

import * as fns from 'date-fns';

export type DefaultSnapshot = TProjectSnapshot & { default: true }
export type GenericSnapshot = TProjectSnapshot | DefaultSnapshot;

export function getDefaultSnapshots(project_id: TProjectSnapshot['project_id'], project_created_at: Date | string) {

    const today: DefaultSnapshot = {
        project_id,
        _id: '___today' as any,
        name: 'Today',
        from: fns.startOfDay(Date.now()),
        to: fns.endOfDay(Date.now()),
        color: '#FFA600',
        default: true
    }

    const lastDay: DefaultSnapshot = {
        project_id,
        _id: '___lastDay' as any,
        name: 'Yesterday',
        from: fns.startOfDay(fns.subDays(Date.now(), 1)),
        to: fns.endOfDay(fns.subDays(Date.now(), 1)),
        color: '#FF8531',
        default: true
    }


    const lastMonth: DefaultSnapshot = {
        project_id,
        _id: '___lastMonth' as any,
        name: 'Last Month',
        from: fns.startOfMonth(fns.subMonths(Date.now(), 1)),
        to: fns.endOfMonth(fns.subMonths(Date.now(), 1)),
        color: '#BC5090',
        default: true
    }
    const currentMonth: DefaultSnapshot = {
        project_id,
        _id: '___currentMonth' as any,
        name: 'Current Month',
        from: fns.startOfMonth(Date.now()),
        to: fns.endOfMonth(Date.now()),
        color: '#58508D',
        default: true
    }


    const lastWeek: DefaultSnapshot = {
        project_id,
        _id: '___lastWeek' as any,
        name: 'Last Week',
        from: fns.startOfWeek(fns.subWeeks(Date.now(), 1)),
        to: fns.endOfWeek(fns.subWeeks(Date.now(), 1)),
        color: '#3E909D',
        default: true
    }


    const currentWeek: DefaultSnapshot = {
        project_id,
        _id: '___currentWeek' as any,
        name: 'Current Week',
        from: fns.startOfWeek(Date.now()),
        to: fns.endOfWeek(Date.now()),
        color: '#007896',
        default: true
    }



    const allTime: DefaultSnapshot = {
        project_id,
        _id: '___allTime' as any,
        name: 'All Time',
        from: fns.addMinutes(fns.startOfMonth(new Date(project_created_at.toString())), -new Date().getTimezoneOffset()),
        to: new Date(Date.now()),
        color: '#9362FF',
        default: true
    }



    const snapshotList = [lastDay, today, lastMonth, currentMonth, lastWeek, currentWeek, allTime]

    return snapshotList;

}
