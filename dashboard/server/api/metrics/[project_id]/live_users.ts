import { Types } from "mongoose";
import { getUserProjectFromId } from "~/server/LIVE_DEMO_DATA";
import { SessionModel } from "@schema/metrics/SessionSchema";

export default defineEventHandler(async event => {

    const project_id = getRequestProjectId(event);
    if (!project_id) return;

    const user = getRequestUser(event);

    const project = await getUserProjectFromId(project_id, user);
    if (!project) return;

    const online_users = await SessionModel.aggregate([
        {
            $match: {
                project_id: new Types.ObjectId(project_id),
                updated_at: { $gt: new Date(Date.now() - 1000 * 60 * 5) }
            }
        },
        { $count: 'count' }
    ]);

    if (!online_users[0]) return 0;

    return online_users[0].count;

});