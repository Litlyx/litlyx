import { AggregateOptions, Model, Types } from "mongoose";
import { ProjectModel } from "@schema/ProjectSchema";


export type MetricsTimeline = {
    _id: string,
    count: number
}

export async function getTimeline(model: Model<any>, project_id: string, slice: 'hour' | 'day' | 'month' | 'year' = 'day', duration?: number, customOptions: AggregateOptions = {}, customGroup: Object = {}, customProjection: Object = {}, customGroupId: Object = {}) {

    const groupId: any = {};
    const sort: any = {};
    const fromParts: any = {};

    const from = new Date();
    const to = new Date();

    from.setMinutes(0, 0, 0);
    to.setMinutes(0, 0, 0);

    switch (slice) {
        case 'day':
            from.setDate(from.getDate() - (duration || 7));
            from.setHours(0);
            to.setHours(0);
            break;
        case 'hour':
            from.setHours(from.getHours() - (duration || 24));
            break;
    }

    switch (slice) {
        case 'hour':
            groupId.hour = { $hour: '$created_at' }
            sort['_id.hour'] = 1;
            fromParts.hour = "$_id.hour";
        case 'day':
            groupId.day = { $dayOfMonth: '$created_at' }
            sort['_id.day'] = 1;
            fromParts.day = "$_id.day";
        case 'month':
            groupId.month = { $month: '$created_at' }
            sort['_id.month'] = 1;
            fromParts.month = "$_id.month";
        case 'year':
            groupId.year = { $year: '$created_at' }
            sort['_id.year'] = 1;
            fromParts.year = "$_id.year";
    }

    const aggregation: any[] = [
        {
            $match: {
                project_id: new Types.ObjectId(project_id),
                created_at: { $gte: from, $lte: to }
            }
        },
        { $group: { _id: { ...groupId, ...customGroupId }, count: { $sum: 1 }, ...customGroup } },
        { $sort: sort },
        { $project: { _id: { $dateFromParts: fromParts }, count: "$count", ...customProjection } }
    ]

    const result: MetricsTimeline[] = await model.aggregate(aggregation, customOptions);

    return { data: result, from, to };
}

export default defineEventHandler(async event => {
    const user = getRequestUser(event);
    if (!user?.logged) return;
    const project_id = getRequestProjectId(event);
    if (!project_id) return;
    const project = await ProjectModel.findOne({ _id: project_id, owner: user.id });
    if (!project) return;

    return;

});