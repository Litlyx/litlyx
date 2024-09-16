import mongoose from "mongoose";
import { executeTimelineAggregation } from "./TimelineService";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { AnomalyDomainModel } from '@schema/anomalies/AnomalyDomainSchema';
import { AnomalyVisitModel } from '@schema/anomalies/AnomalyVisitSchema';
import { AnomalyEventsModel } from '@schema/anomalies/AnomalyEventsSchema';
import { EventModel } from "@schema/metrics/EventSchema";
import EmailService from "@services/EmailService";

import * as url from 'url';
import { ProjectModel } from "@schema/ProjectSchema";
import { UserModel } from "@schema/UserSchema";

type TAvgInput = { _id: string, count: number }

const anomalyData = { minutes: 0 }

async function anomalyCheckAll() {
    const start = performance.now();
    console.log('[ANOMALY] START ANOMALY CHECK');
    const projects = await ProjectModel.find({}, { _id: 1 });
    for (const project of projects) {
        await findAnomalies(project.id);
    }
    const end = performance.now() - start;
    console.log('END ANOMALY CHECK', end, 'ms');
}

export function anomalyLoop() {
    if (anomalyData.minutes == 60 * 12) {
        anomalyCheckAll();
        anomalyData.minutes = 0;
    }
    anomalyData.minutes++;
    setTimeout(() => anomalyLoop(), 1000 * 60);
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

export async function findAnomalies(project_id: string) {

    const THRESHOLD = 6;
    const WINDOW_SIZE = 14;

    const pid = new mongoose.Types.ObjectId(project_id) as any;

    const from = Date.now() - 1000 * 60 * 60 * 24 * 30;
    const to = Date.now() - 1000 * 60 * 60 * 24;

    const visitsTimelineData = await executeTimelineAggregation({
        projectId: pid,
        model: VisitModel,
        from, to, slice: 'day'
    });

    const eventsTimelineData = await executeTimelineAggregation({
        projectId: pid,
        model: EventModel,
        from, to, slice: 'day'
    });

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

    const shouldSendMail = {
        visitsEvents: false,
        domains: false
    }

    for (const visit of visitAnomalies) {
        const anomalyAlreadyExist = await AnomalyVisitModel.findOne({ visitDate: visit._id }, { _id: 1 });
        if (anomalyAlreadyExist) continue;
        await AnomalyVisitModel.create({ project_id: pid, visitDate: visit._id, created_at: Date.now() });
        shouldSendMail.visitsEvents = true;
    }

    for (const event of eventAnomalies) {
        const anomalyAlreadyExist = await AnomalyEventsModel.findOne({ eventDate: event._id }, { _id: 1 });
        if (anomalyAlreadyExist) continue;
        await AnomalyEventsModel.create({ project_id: pid, eventDate: event._id, created_at: Date.now() });
        shouldSendMail.visitsEvents = true;
    }

    for (const website of detectedWebsites) {
        const anomalyAlreadyExist = await AnomalyDomainModel.findOne({ domain: website }, { _id: 1 });
        if (anomalyAlreadyExist) continue;
        await AnomalyDomainModel.create({ project_id: pid, domain: website, created_at: Date.now() });
        shouldSendMail.domains = true;
    }


    const project = await ProjectModel.findById(pid);
    if (!project) return { ok: false, error: 'Cannot find project with id ' + pid.toString() }
    const user = await UserModel.findById(project.owner);
    if (!user) return { ok: false, error: 'Cannot find user with id ' + project.owner.toString() }

    if (shouldSendMail.visitsEvents === true) {
        await EmailService.sendAnomalyVisitsEventsEmail(user.email, project.name);
    }
    if (shouldSendMail.domains === true) {
        await EmailService.sendAnomalyDomainEmail(user.email, project.name);
    }


    return { ok: true };


}
