import { VisitModel } from "@schema/metrics/VisitSchema";



export async function getVisitsCountFromDateRange(project_id: string, from?: string, to?: string) {
    const result = await VisitModel.countDocuments({
        project_id,
        created_at: {
            $gt: from ? new Date(from).getTime() : new Date(2023).getTime(),
            $lt: to ? new Date(to).getTime() : new Date().getTime(),
        }
    });
    return { count: result };
}