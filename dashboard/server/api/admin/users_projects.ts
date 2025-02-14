import { ProjectModel, TProject } from "@schema/project/ProjectSchema";
import { TUser, UserModel } from "@schema/UserSchema";
import { TProjectLimit } from "~/shared/schema/project/ProjectsLimits";

export type TAdminUserProjectInfo = TUser & {
    projects: (TProject & {
        limits: TProjectLimit[],
        visits: number,
        events: number,
        sessions: number
    })[],
}

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return;
    if (!userData.user.roles.includes('ADMIN')) return;

    const { page, limit, sortQuery } = getQuery(event);

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const users = await UserModel.aggregate([
        {
            $lookup: {
                from: "projects",
                localField: "_id",
                foreignField: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "project_limits",
                            localField: "_id",
                            foreignField: "project_id",
                            as: "limits"
                        }
                    },
                    {
                        $lookup: {
                            from: "visits",
                            localField: "_id",
                            foreignField: "project_id",
                            pipeline: [
                                {
                                    $count: "total_visits"
                                }
                            ],
                            as: "visit_data"
                        }
                    },
                    {
                        $lookup: {
                            from: "events",
                            localField: "_id",
                            foreignField: "project_id",
                            pipeline: [
                                {
                                    $count: "total_events"
                                }
                            ],
                            as: "event_data"
                        }
                    },
                    {
                        $lookup: {
                            from: "sessions",
                            localField: "_id",
                            foreignField: "project_id",
                            pipeline: [
                                {
                                    $count: "total_sessions"
                                }
                            ],
                            as: "session_data"
                        }
                    },
                    { $addFields: { visits: { $ifNull: [{ $arrayElemAt: ["$visit_data.total_visits", 0] }, 0] } } },
                    { $addFields: { events: { $ifNull: [{ $arrayElemAt: ["$event_data.total_events", 0] }, 0] } } },
                    { $addFields: { sessions: { $ifNull: [{ $arrayElemAt: ["$session_data.total_sessions", 0] }, 0] } }, },
                    { $unset: "visit_data" },
                    { $unset: "event_data" },
                    { $unset: "session_data" }

                ],
                as: "projects"
            },
        },
        { $sort: JSON.parse(sortQuery as string) },
        { $skip: pageNumber * limitNumber },
        { $limit: limitNumber }
    ]);

    return users as TAdminUserProjectInfo[];

});