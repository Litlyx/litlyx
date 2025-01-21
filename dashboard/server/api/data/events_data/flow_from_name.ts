

import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";


export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false });
    if (!data) return;

    const { project_id, from, to } = data;

    const { name: eventName } = getQuery(event);

    if (!eventName) return setResponseStatus(event, 400, 'name is required');

    const allEvents = await EventModel.find({
        project_id: project_id,
        name: eventName,
        created_at: {
            $gte: new Date(from),
            $lte: new Date(to),
        }
    }, { flowHash: 1 });


    const allFlowHashes = new Map<string, number>();

    allEvents.forEach(e => {
        if (!e.flowHash) return;
        if (e.flowHash.length == 0) return;
        if (allFlowHashes.has(e.flowHash)) {
            const count = allFlowHashes.get(e.flowHash) as number;
            allFlowHashes.set(e.flowHash, count + 1);
        } else {
            allFlowHashes.set(e.flowHash, 1);
        }
    });

    const flowHashIds = Array.from(allFlowHashes.keys());

    const allReferrers: { referrer: string, flowHash: string }[] = [];

    const promises: any[] = [];
    while (flowHashIds.length > 0) {
        promises.push(new Promise<void>(async resolve => {
            const flowHashIdsChunk = flowHashIds.splice(0, 10);
            const visits = await VisitModel.find({ project_id, flowHash: { $in: flowHashIdsChunk } }, { referrer: 1, flowHash: 1 });
            allReferrers.push(...visits.map(e => { return { referrer: e.referrer, flowHash: e.flowHash } }));
            resolve();
        }));
    }

    await Promise.all(promises);

    const groupedFlows: Record<string, { referrers: string[] }> = {};

    flowHashIds.forEach(flowHash => {
        if (!groupedFlows[flowHash]) groupedFlows[flowHash] = { referrers: [] };
        const target = groupedFlows[flowHash];
        if (!target) return;
        const referrers = allReferrers.filter(e => e.flowHash === flowHash).map(e => e.referrer);
        for (const referrer of referrers) {
            if (target.referrers.includes(referrer)) continue;
            target.referrers.push(referrer);
        }
    });

    const grouped: Record<string, number> = {};

    for (const referrerPlusHash of allReferrers) {
        const referrer = referrerPlusHash.referrer;
        if (!grouped[referrer]) grouped[referrer] = 0
        grouped[referrer]++;
    }


    const eventsCount = allEvents.length;

    const allGroupedValue = Object.keys(grouped)
        .map(key => grouped[key])
        .reduce((a, e) => a + e, 0);

    for (const key in grouped) {
        grouped[key] = 100 / allGroupedValue * grouped[key];
    }

    return grouped;

});
