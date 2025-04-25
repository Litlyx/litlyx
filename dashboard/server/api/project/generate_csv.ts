

import { VisitModel } from "@schema/metrics/VisitSchema";
import { EventModel } from "~/shared/schema/metrics/EventSchema";

export default defineEventHandler(async event => {

    const data = await getRequestData(event, [], []);
    if (!data) return;

    const { project_id } = data;

    const { mode, slice } = getQuery(event);

    let timeSub = 1000 * 60 * 60 * 24;

    if (slice == '0') {
        timeSub = 1000 * 60 * 60 * 24
    } else if (slice == '1') {
        timeSub = 1000 * 60 * 60 * 24 * 7
    } else if (slice == '2') {
        timeSub = 1000 * 60 * 60 * 24 * 7 * 30
    } else if (slice == '3') {
        timeSub = 1000 * 60 * 60 * 24 * 7 * 30 * 12 * 2
    }

    if (mode === 'visits') {

        const visistsReportData = await VisitModel.find({
            project_id,
            created_at: {
                $gt: Date.now() - timeSub
            }
        });

        const csvHeader = [
            "browser",
            "os",
            "continent",
            "country",
            "device",
            "website",
            "page",
            "referrer",
            "created_at",
        ];


        const lines: any[] = [];
        visistsReportData.forEach(line => lines.push(line.toJSON()));

        const result = csvHeader.join(',') + '\n' + lines.map(element => {
            const content: string[] = [];
            for (const key of csvHeader) {
                content.push(element[key]);
            }
            return content.join(',');
        }).join('\n');


        return result;
    } else if (mode === 'events') {


        const eventsReportData = await EventModel.find({
            project_id,
            created_at: {
                $gt: Date.now() - timeSub
            }
        });

        const csvHeader = [
            "name",
            "session",
            "metadata",
            "website",
            "created_at",
        ];


        const lines: any[] = [];
        eventsReportData.forEach(line => lines.push(line.toJSON()));

        const result = csvHeader.join(',') + '\n' + lines.map(element => {
            const content: string[] = [];
            for (const key of csvHeader) {
                content.push(element[key]);
            }
            return content.join(',');
        }).join('\n');


        return result;



    } else {
        return '';
    }


});