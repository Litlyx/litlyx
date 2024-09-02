import { VisitModel } from "@schema/metrics/VisitSchema";
import { Redis, TIMELINE_EXPIRE_TIME } from "~/server/services/CacheService";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import DateService from "@services/DateService";
import { executeTimelineAggregation, fillAndMergeTimelineAggregation } from "~/server/services/TimelineService";

import fs from 'fs';

export default defineEventHandler(async event => {
    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;


    const { slice, from, to } = await readBody(event);

    if (!from) return setResponseStatus(event, 400, 'from is required');
    if (!to) return setResponseStatus(event, 400, 'to is required');
    if (!slice) return setResponseStatus(event, 400, 'slice is required');

    // return await Redis.useCache({
    //     key: `timeline:visits:${project_id}:${slice}:${from || 'none'}:${to || 'none'}`,
    //     exp: TIMELINE_EXPIRE_TIME,
    // }, async () => {
    const timelineData = await executeTimelineAggregation({
        projectId: project._id,
        model: VisitModel,
        from, to, slice,
        debug: true
    });

    console.log(timelineData);
    fs.writeFileSync('explains/timeline-visits.json', JSON.stringify(timelineData));

    // const timelineFilledMerged = fillAndMergeTimelineAggregation(timelineData, slice);
    // return timelineFilledMerged;
    // });




});