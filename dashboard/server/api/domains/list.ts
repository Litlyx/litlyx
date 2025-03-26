
import { VisitModel } from "@schema/metrics/VisitSchema";
import { TeamMemberModel } from "~/shared/schema/TeamMemberSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, []);
    if (!data) return;

    const { project_id, project, user } = data;

    const result: { _id: string, visits: number }[] = await VisitModel.aggregate([
        { $match: { project_id, } },
        { $group: { _id: "$website", visits: { $sum: 1 } } },
    ]);

    const isOwner = user.id === project.owner.toString();
    if (isOwner) return [
        {
            _id: 'All domains',
            visits: result.reduce((a, e) => a + e.visits, 0)
        },
        ...result
    ]

    const member = await TeamMemberModel.findOne({ project_id, $or: [{ user_id: user.id }, { email: user.user.email }], pending: false });
    if (!member) return setResponseStatus(event, 400, 'Not a member');
    if (!member.permission) return setResponseStatus(event, 400, 'No permission');

    if (member.permission.domains.includes('All domains')) {
        return [
            {
                _id: 'All domains',
                visits: result.reduce((a, e) => a + e.visits, 0)
            },
            ...result
        ]
    }

    return result.filter(e => {
        return member.permission.domains.includes(e._id);
    });


});