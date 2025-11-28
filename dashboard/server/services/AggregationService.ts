import { getAllDomains } from "../controllers/DomainController";
import { visitController } from "../controllers/VisitController";
import { sessionController } from "../controllers/SessionController";
import { bouncingController } from "../controllers/BouncingController";
import { durationController } from "../controllers/DurationController";
import { ProjectCountModel } from "~/shared/schema/project/ProjectsCounts";

export async function executeAggregationProject(project_id: string, date: Date, override: boolean) {
    const domains = await getAllDomains({ project_id, date });
    await Promise.all([
        visitController.aggregate({ project_id, date, domains, override }),
        sessionController.aggregate({ project_id, date, domains, override }),
        bouncingController.aggregate({ project_id, date, domains, override }),
        durationController.aggregate({ project_id, date, domains, override })
    ]);
}


export async function executeAggregation(date: Date) {
    const targets = await ProjectCountModel.find({ visits: { $gte: 500_000 } }, {}, { lean: true, sort: { visits: -1 } });
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const project_id = target.project_id.toString();
        await executeAggregationProject(project_id, date, true);      
    }
}