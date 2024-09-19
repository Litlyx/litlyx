import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";

import { AnomalyDomainModel } from '@schema/anomalies/AnomalyDomainSchema';
import { AnomalyEventsModel } from '@schema/anomalies/AnomalyEventsSchema';
import { AnomalyVisitModel } from '@schema/anomalies/AnomalyVisitSchema';


type TSecurityDomainEntry = { type: 'domain', data: { domain: string, created_at: Date } }
type TSecurityVisitEntry = { type: 'visit', data: { visitDate: Date, created_at: Date } }
type TSecurityEventEntry = { type: 'event', data: { eventDate: Date, created_at: Date } }



export type SecutityReport = (TSecurityDomainEntry | TSecurityVisitEntry | TSecurityEventEntry)[];

export default defineEventHandler(async event => {

    const project_id = getHeader(event, 'x-pid');
    if (!project_id) return;

    const user = getRequestUser(event);
    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const visits = await AnomalyVisitModel.find({ project_id }, { _id: 0, project_id: 0 });
    const events = await AnomalyEventsModel.find({ project_id }, { _id: 0, project_id: 0 });
    const domains = await AnomalyDomainModel.find({ project_id }, { _id: 0, project_id: 0 });

    const report: SecutityReport = [];

    for (const visit of visits) {
        report.push({ type: 'visit', data: visit });
    }
    for (const event of events) {
        report.push({ type: 'event', data: event });
    }
    for (const domain of domains) {
        report.push({ type: 'domain', data: domain });
    }

    return report.toSorted((a, b) => a.data.created_at.getTime() - b.data.created_at.getTime());


});