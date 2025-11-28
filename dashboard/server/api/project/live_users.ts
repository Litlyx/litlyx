import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import dayjs from 'dayjs';

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'permission:member');
    const { project_id } = ctx;

    const timespan = dayjs(Date.now() - 1000 * 60 * 5).utc().toDate()

    const live_users = await VisitModel.aggregate([
        {
            $match: {
                project_id,
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