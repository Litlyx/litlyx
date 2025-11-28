
import { VisitModel } from "@schema/metrics/VisitSchema";
import { EventModel } from "~/shared/schema/metrics/EventSchema";
import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";


export type TDomainSimpleRes = { _id: string, name: string }

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'permission:member');

    const { project_id, project, user_id, user_email } = ctx;

    const result_visits: TDomainSimpleRes[] = await VisitModel.aggregate([
        { $match: { project_id } },
        { $group: { _id: "$website" } },
        { $project: { _id: 0, name: "$_id" } }
    ]);

    const result_events: TDomainSimpleRes[] = await EventModel.aggregate([
        { $match: { project_id } },
        { $group: { _id: "$website" } },
        { $project: { _id: 0, name: "$_id" } }
    ]);


    const result: TDomainSimpleRes[] = result_visits;

    result_events.forEach(e => {
        if (result.find(e => e.name === e.name)) return;
        result.push(e);
    });

    const isOwner = user_id === project.owner.toString();
    if (isOwner) return [
        {
            _id: '*',
            name: 'All domains',
        },
        ...result.map(e => ({ ...e, _id: e.name }))
    ] as TDomainSimpleRes[];


    //TODO: Create admin list
    if (user_email !== 'helplitlyx@gmail.com') {
        const member = await TeamMemberModel.findOne({ project_id, $or: [{ user_id }, { email: user_email }], pending: false });
        if (!member) return setResponseStatus(event, 400, 'Not a member');
        if (!member.permission) return setResponseStatus(event, 400, 'No permission');

        if (member.permission.domains.includes('*')) {
            return [
                {
                    _id: '*',
                    name: 'All domains'
                },
                ...result
            ] as TDomainSimpleRes[];
        }

        return result.filter(e => {
            return member.permission.domains.includes(e.name);
        }).map(e => ({ ...e, _id: e.name })) as TDomainSimpleRes[];
    } else {
        return [
            {
                _id: '*',
                name: 'All domains',
            },
            ...result.map(e => ({ ...e, _id: e.name }))
        ] as TDomainSimpleRes[];
    }



});