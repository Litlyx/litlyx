import type { Slice } from "@services/DateService";
import DateService from "@services/DateService";
import type { MetricsCounts } from "~/server/api/metrics/[project_id]/counts";
import type { BrowsersAggregated } from "~/server/api/metrics/[project_id]/data/browsers";
import type { CountriesAggregated } from "~/server/api/metrics/[project_id]/data/countries";
import type { DevicesAggregated } from "~/server/api/metrics/[project_id]/data/devices";
import type { CustomEventsAggregated } from "~/server/api/metrics/[project_id]/data/events";
import type { OssAggregated } from "~/server/api/metrics/[project_id]/data/oss";
import type { ReferrersAggregated } from "~/server/api/metrics/[project_id]/data/referrers";
import type { VisitsWebsiteAggregated } from "~/server/api/metrics/[project_id]/data/websites";
import type { MetricsTimeline } from "~/server/api/metrics/[project_id]/timeline/generic";

export function useMetricsData() {
    const activeProject = useActiveProject();
    const metricsInfo = useFetch<MetricsCounts>(`/api/metrics/${activeProject.value?._id}/counts`, {
        ...signHeaders(),
        lazy: true
    });
    return metricsInfo;
}




const { safeSnapshotDates, snapshot } = useSnapshot()
const activeProject = useActiveProject();

const createFromToHeaders = (headers: Record<string, string> = {}) => ({
    'x-from': safeSnapshotDates.value.from,
    'x-to': safeSnapshotDates.value.to,
    ...headers
});

const createFromToBody = (body: Record<string, any> = {}) => ({
    from: safeSnapshotDates.value.from,
    to: safeSnapshotDates.value.to,
    ...body
});



export function useFirstInteractionData() {
    const activeProject = useActiveProject();
    const metricsInfo = useFetch<boolean>(`/api/metrics/${activeProject.value?._id}/first_interaction`, signHeaders());
    return metricsInfo;
}


export function useTimelineAdvanced(endpoint: string, slice: Ref<Slice>, customBody: Object = {}) {
    const response = useCustomFetch<{ _id: string, count: number }[]>(
        `/api/metrics/${activeProject.value?._id}/timeline/${endpoint}`,
        () => signHeaders({ 'Content-Type': 'application/json' }).headers, {
        method: 'POST',
        getBody: () => createFromToBody({ slice: slice.value, ...customBody }),
        lazy: true,
        watchProps: [snapshot, slice]
    });
    return response;
}


export function useTimeline(endpoint: 'visits' | 'sessions' | 'referrers', slice: Ref<Slice>) {
    return useTimelineAdvanced(endpoint, slice);
}

export async function useReferrersTimeline(referrer: string, slice: Ref<Slice>) {
    return await useTimelineAdvanced('referrers', slice, { referrer });
}



export async function useTimelineDataRaw(timelineEndpointName: string, slice: SliceName) {
    const activeProject = useActiveProject();

    const response = await $fetch<{ data: MetricsTimeline[], from: string, to: string }>(
        `/api/metrics/${activeProject.value?._id}/timeline/${timelineEndpointName}`, {
        method: 'POST',
        ...signHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ slice }),
    });

    return response;
}

export async function useTimelineData(timelineEndpointName: string, slice: SliceName) {
    const response = await useTimelineDataRaw(timelineEndpointName, slice);
    if (!response) return;
    const fixed = fixMetrics(response, slice);
    return fixed;
}

export function usePagesData(website: string, limit: number = 10) {
    const activeProject = useActiveProject();

    const res = useFetch<VisitsWebsiteAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/pages`, {
        ...signHeaders({
            'x-query-limit': limit.toString(),
            'x-website-name': website
        }),
        key: `pages_data:${website}:${limit}`,
        lazy: true
    });

    return res;

}




export function useWebsitesData(limit: number = 10) {
    const res = useCustomFetch<ReferrersAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/websites`,
        () => signHeaders(createFromToHeaders({ 'x-query-limit': limit.toString() })).headers,
        { lazy: false, watchProps: [snapshot] }
    );
    return res;
}

export function useEventsData(limit: number = 10) {
    const res = useCustomFetch<CustomEventsAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/events`,
        () => signHeaders(createFromToHeaders({ 'x-query-limit': limit.toString() })).headers,
        { lazy: false, watchProps: [snapshot] }
    );
    return res;
}

export function useReferrersData(limit: number = 10) {
    const res = useCustomFetch<ReferrersAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/referrers`,
        () => signHeaders(createFromToHeaders({ 'x-query-limit': limit.toString() })).headers,
        { lazy: false, watchProps: [snapshot] }
    );
    return res;
}

export function useBrowsersData(limit: number = 10) {
    const res = useCustomFetch<BrowsersAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/browsers`,
        () => signHeaders(createFromToHeaders({ 'x-query-limit': limit.toString() })).headers,
        { lazy: false, watchProps: [snapshot] }
    );
    return res;
}

export function useOssData(limit: number = 10) {
    const res = useCustomFetch<OssAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/oss`,
        () => signHeaders(createFromToHeaders({ 'x-query-limit': limit.toString() })).headers,
        { lazy: false, watchProps: [snapshot] }
    );
    return res;
}

export function useGeolocationData(limit: number = 10) {
    const res = useCustomFetch<CountriesAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/countries`,
        () => signHeaders(createFromToHeaders({ 'x-query-limit': limit.toString() })).headers,
        { lazy: false, watchProps: [snapshot] }
    );
    return res;
}

export function useDevicesData(limit: number = 10) {
    const res = useCustomFetch<DevicesAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/devices`,
        () => signHeaders(createFromToHeaders({ 'x-query-limit': limit.toString() })).headers,
        { lazy: false, watchProps: [snapshot] }
    );
    return res;
}