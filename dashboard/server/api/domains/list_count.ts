
import { VisitModel } from "@schema/metrics/VisitSchema";
import { EventModel } from "~/shared/schema/metrics/EventSchema";
import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";


export type TDomainRes = { _id: string, name: string, visits: number }

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid');

    const { project_id, project, user_id, user_email } = ctx;

    const result_visits = await VisitModel.aggregate([
        { $match: { project_id, } },
        { $group: { _id: "$website", visits: { $sum: 1 } } },
        { $addFields: { name: '$_id' } }
    ]);
    const result_events = await EventModel.aggregate([
        { $match: { project_id, } },
        { $group: { _id: "$website", visits: { $sum: 1 } } },
        { $addFields: { name: '$_id' } }
    ]);

    const result: TDomainRes[] = result_visits;

    result_events.forEach(e => {
        if (result.find(e => e.name === e.name)) return;
        result.push(e);
    });
    
    const isOwner = user_id === project.owner.toString();
    if (isOwner) return [
        {
            _id: '*',
            name: 'All domains',
            visits: result.reduce((a, e) => a + e.visits, 0)
        },
        ...result
    ] as TDomainRes[];

    const member = await TeamMemberModel.findOne({ project_id, $or: [{ user_id }, { email: user_email }], pending: false });
    if (!member) return setResponseStatus(event, 400, 'Not a member');
    if (!member.permission) return setResponseStatus(event, 400, 'No permission');

    if (member.permission.domains.includes('*')) {
        return [
            {
                _id: '*',
                name: 'All domains',
                visits: result.reduce((a, e) => a + e.visits, 0)
            },
            ...result
        ] as TDomainRes[];
    }

    return result.filter(e => {
        return member.permission.domains.includes(e._id);
    }) as TDomainRes[];


});