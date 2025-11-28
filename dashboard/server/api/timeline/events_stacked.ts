import { Redis } from "~/server/services/CacheService";
import { executeAdvancedTimelineAggregation } from "~/server/services/TimelineService";
import { EventModel } from "~/shared/schema/metrics/EventSchema";

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'domain', 'range', 'slice', 'permission:events');

    const { pid, project_id, domain, from, to, slice } = ctx;

    const cacheKey = `timeline:events_stacked:${pid}:${slice}:${from}:${to}:${domain}`;
    const cacheExp = 60;

    return await Redis.useCache(cacheKey, cacheExp, async () => {

        const timelineData = await executeAdvancedTimelineAggregation({
            projectId: project_id,
            model: EventModel,
            from, to, slice, domain,
            customIdGroup: {
                event: '$name'
            },
            customProjection: {
                events: 1
            },
            customQueries: [
                {
                    index: 2, query: {
                        $group: {
                            _id: {
                                date: "$_id.date"
                            },
                            events: {
                                $push: {
                                    name: "$_id.event",
                                    count: "$count"
                                }
                            }
                        }
                    }
                }
            ]
        });

        return timelineData;

    });



});