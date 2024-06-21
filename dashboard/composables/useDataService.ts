import type { Slice } from "@services/DateService";
import DateService from "@services/DateService";
import type { MetricsCounts } from "~/server/api/metrics/[project_id]/counts";
import type { VisitsWebsiteAggregated } from "~/server/api/metrics/[project_id]/data/websites";
import type { MetricsTimeline } from "~/server/api/metrics/[project_id]/timeline/generic";

export function useMetricsData() {
    const activeProject = useActiveProject();
    const metricsInfo = useFetch<MetricsCounts>(`/api/metrics/${activeProject.value?._id}/counts`, signHeaders());
    return metricsInfo;
}

export function useFirstInteractionData() {
    const activeProject = useActiveProject();
    const metricsInfo = useFetch<boolean>(`/api/metrics/${activeProject.value?._id}/first_interaction`, signHeaders());
    return metricsInfo;
}

export async function useVisitsTimeline(slice: Slice, fromDate?: string, toDate?: string) {

    const { from, to } = DateService.prepareDateRange(
        fromDate || DateService.getDefaultRange(slice).from,
        toDate || DateService.getDefaultRange(slice).to,
        slice
    );

    const activeProject = useActiveProject();
    const response = await $fetch(
        `/api/metrics/${activeProject.value?._id}/timeline/visits`, {
        method: 'POST',
        ...signHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ slice, from, to })
    });
    
    return response;

}

export async function useTimelineDataRaw(timelineEndpointName: string, slice: SliceName) {
    const activeProject = useActiveProject();

    const response = await $fetch<{ data: MetricsTimeline[], from: string, to: string }>(
        `/api/metrics/${activeProject.value?._id}/timeline/${timelineEndpointName}`, {
        method: 'POST',
        ...signHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ slice })
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
    });

    return res;

}

export function useWebsitesData(limit: number = 10) {
    const activeProject = useActiveProject();
    const res = useFetch<VisitsWebsiteAggregated[]>(`/api/metrics/${activeProject.value?._id}/data/websites`, {
        ...signHeaders({ 'x-query-limit': limit.toString() }),
        key: `websites_data:${limit}`,
    });
    return res;
}
