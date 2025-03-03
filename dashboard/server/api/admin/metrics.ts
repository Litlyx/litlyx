import { ProjectModel } from "@schema/project/ProjectSchema";
import { UserModel } from "@schema/UserSchema";
import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from "@schema/metrics/VisitSchema";

export default defineEventHandler(async event => {
    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { filterFrom, filterTo } = getQuery(event);


    const matchQuery = {
        created_at: {
            $gte: new Date(filterFrom as string),
            $lte: new Date(filterTo as string)
        }
    }

    const totalProjects = await ProjectModel.countDocuments({ ...matchQuery });
    const premiumProjects = await ProjectModel.countDocuments({ ...matchQuery, premium: true });

    const deadProjects = await ProjectModel.countDocuments({ ...matchQuery });

    const totalUsers = await UserModel.countDocuments({ ...matchQuery });

    const totalVisits = 0;

    const totalEvents = await EventModel.countDocuments({ ...matchQuery });


    return { totalProjects, premiumProjects, deadProjects, totalUsers, totalVisits, totalEvents }


});