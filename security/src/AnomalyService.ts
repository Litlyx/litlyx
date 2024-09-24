import mongoose from "mongoose";
import { AnomalyDomainModel } from '@schema/anomalies/AnomalyDomainSchema';
import { AnomalyVisitModel } from '@schema/anomalies/AnomalyVisitSchema';
import { AnomalyEventsModel } from '@schema/anomalies/AnomalyEventsSchema';
import { EventModel } from "@schema/metrics/EventSchema";
import { VisitModel } from '@schema/metrics/VisitSchema'

import * as url from 'url';
import { ProjectModel } from "@schema/ProjectSchema";
import { getAggregation } from "./Aggregations";

type TAvgInput = { _id: string, count: number }

export type AnomalyReport = {
    visits: TAvgInput[],
    events: TAvgInput[],
    dns: string[],
    pid: string
}

export type AnomalyCallback = (report: AnomalyReport) => any;

const anomalyData = { minutes: 0 }

export async function anomalyCheckAll(callback: AnomalyCallback) {
    const start = performance.now();
    console.log('[ANOMALY] START ANOMALY CHECK');
    const projects = await ProjectModel.find({}, { _id: 1 });
    let i = 0;
    for (const project of projects) {
        console.log('Project:', i++, '/', projects.length);
        await findAnomalies(project.id, callback);
    }
    const end = performance.now() - start;
    console.log('END ANOMALY CHECK', end, 'ms');
}

export function anomalyLoop(callback: AnomalyCallback) {
    if (anomalyData.minutes == 60 * 12) {
        anomalyCheckAll(callback);
        anomalyData.minutes = 0;
    }
    anomalyData.minutes++;
    setTimeout(() => anomalyLoop(callback), 1000 * 60);
}


function movingAverageAnomaly(visits: TAvgInput[], windowSize: number, threshold: number): TAvgInput[] {
    const anomalies: TAvgInput[] = [];
    for (let i = windowSize; i < visits.length; i++) {
        const window = visits.slice(i - windowSize, i);
        const mean = window.reduce((a, b) => a + b.count, 0) / window.length;
        const stdDev = Math.sqrt(window.reduce((sum, visit) => sum + Math.pow(visit.count - mean, 2), 0) / window.length);
        const currentVisit = visits[i];
        if (Math.abs(currentVisit.count - mean) > threshold * stdDev) {
            if (currentVisit.count <= mean) continue;
            anomalies.push(currentVisit);
        }
    }
    return anomalies;
}

function getUrlFromString(str: string) {
    const res = str.startsWith('http') ? str : 'http://' + str;
    return res;
}

export async function findAnomalies(project_id: string, callback: AnomalyCallback) {

    const THRESHOLD = 6;
    const WINDOW_SIZE = 14;

    const pid = new mongoose.Types.ObjectId(project_id) as any;

    const from = Date.now() - 1000 * 60 * 60 * 24 * 30;
    const to = Date.now() - 1000 * 60 * 60 * 24;

    const visitsTimelineData = await getAggregation(VisitModel, pid, from, to, 'day');

    const eventsTimelineData = await getAggregation(EventModel, pid, from, to, 'day');


    const websites: { _id: string, count: number }[] = await VisitModel.aggregate([
        { $match: { project_id: pid, created_at: { $gte: new Date(from), $lte: new Date(to) } }, },
        { $group: { _id: "$website", count: { $sum: 1, } } }
    ]);


    const detectedWebsites: string[] = [];

    if (websites.length > 0) {
        const rootWebsite = websites.reduce((a, e) => {
            return a.count > e.count ? a : e;
        });
        const rootDomain = new url.URL(getUrlFromString(rootWebsite._id)).hostname;
        for (const website of websites) {
            const websiteDomain = new url.URL(getUrlFromString(website._id)).hostname;

            if (websiteDomain === 'localhost') continue;
            if (websiteDomain === '127.0.0.1') continue;
            if (websiteDomain === '0.0.0.0') continue;

            if (!websiteDomain.includes(rootDomain)) { detectedWebsites.push(website._id); }
        }
    }

    const visitAnomalies = movingAverageAnomaly(visitsTimelineData, WINDOW_SIZE, THRESHOLD);
    const eventAnomalies = movingAverageAnomaly(eventsTimelineData, WINDOW_SIZE, THRESHOLD);

    const report: AnomalyReport = {
        visits: [],
        events: [],
        dns: [],
        pid: project_id,
    }

    for (const visit of visitAnomalies) {
        const anomalyAlreadyExist = await AnomalyVisitModel.findOne({ visitDate: visit._id }, { _id: 1 });
        if (anomalyAlreadyExist) continue;
        await AnomalyVisitModel.create({ project_id: pid, visitDate: visit._id, created_at: Date.now() });
        report.visits.push(visit);
    }

    for (const event of eventAnomalies) {
        const anomalyAlreadyExist = await AnomalyEventsModel.findOne({ eventDate: event._id }, { _id: 1 });
        if (anomalyAlreadyExist) continue;
        await AnomalyEventsModel.create({ project_id: pid, eventDate: event._id, created_at: Date.now() });
        report.events.push(event);
    }

    for (const website of detectedWebsites) {
        const anomalyAlreadyExist = await AnomalyDomainModel.findOne({ domain: website }, { _id: 1 });
        if (anomalyAlreadyExist) continue;
        await AnomalyDomainModel.create({ project_id: pid, domain: website, created_at: Date.now() });
        report.dns.push(website);
    }

    callback(report);
    return report;


}
