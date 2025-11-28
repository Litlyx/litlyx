import { EventModel } from "~/shared/schema/metrics/EventSchema";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { PremiumModel } from "~/shared/schema/PremiumSchema";
import { ProjectModel } from "~/shared/schema/project/ProjectSchema";

export type TAdminCounts = {
    projects: number;
    paid: number;
    appsumo: number;
    active: number;
    dead: number;
    visits: number;
    events: number;
    users: number;
    free_trial: number;
    free_trial_ended: number;
}

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'admin');

    const projects = await ProjectModel.countDocuments({});

    const users = await PremiumModel.countDocuments();

    const premium = await PremiumModel.countDocuments({
        premium_type: {
            $in: [
                8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010
            ]
        }
    });

    const free_trial = await PremiumModel.countDocuments({ premium_type: 7006 });
    const free_trial_ended = await PremiumModel.countDocuments({ premium_type: 7999 });

    const appsumo = await PremiumModel.countDocuments({ premium_type: { $in: [6001, 6002, 6003, 6004] } });

    const result = await ProjectModel.aggregate([
        {
            $lookup: {
                from: "visits",
                let: {
                    projectId: "$_id"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$project_id",
                                            "$$projectId"
                                        ]
                                    },
                                    {
                                        $gte: [
                                            "$created_at",
                                            {
                                                $dateSubtract: {
                                                    startDate: "$$NOW",
                                                    unit: "day",
                                                    amount: 3
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $limit: 1
                    }
                ],
                as: "recent_visit"
            }
        },
        {
            $match: {
                "recent_visit.0": {
                    $exists: true
                }
            }
        },
        {
            $count: "active"
        }
    ])


    const visits = await VisitModel.estimatedDocumentCount();
    const events = await EventModel.estimatedDocumentCount();

    const active = result.length == 0 ? 0 : result[0].active;

    return {
        projects,
        users,
        paid: premium,
        appsumo,
        active,
        dead: projects - active,
        visits,
        events,
        free_trial,
        free_trial_ended
    } as TAdminCounts;

});