
import { SessionModel } from "@schema/metrics/SessionSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, { requireSchema: false });
    if (!data) return;

    const {  project_id } = data;

    const online_users = await SessionModel.aggregate([
        {
            $match: {
                project_id,
                updated_at: { $gt: new Date(Date.now() - 1000 * 60 * 5) }
            }
        },
        { $count: 'count' }
    ]);

    if (!online_users[0]) return 0;

    return online_users[0].count;

});