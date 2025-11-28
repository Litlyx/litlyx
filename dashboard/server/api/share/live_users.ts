import dayjs from "dayjs";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { ProjectShareModel } from "~/shared/schema/project/ProjectShareSchema";

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'pid', 'flag:allowShare');
    const { linkId } = getQuery(event);
    if (!linkId) return;

    const target = await ProjectShareModel.findOne({ link: linkId.toString() });
    if (!target) return;

    const timespan = dayjs(Date.now() - 1000 * 60 * 5).utc().toDate()

    const live_users = await VisitModel.aggregate([
        {
            $match: {
                project_id: target._id,
                created_at: { $gte: timespan }
            }
        },
        {
            $group: {
                _id: '$session',
                session: { $sum: 1 }
            }
        },
        {
            $count: 'sessions'
        }
    ]);

    return live_users[0]?.sessions || 0 as number;

}); 