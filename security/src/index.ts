import { anomalyCheckAll, AnomalyReport } from "./AnomalyService";
import { connectDatabase } from '@services/DatabaseService'
import { requireEnv } from '@utils/requireEnv'

connectDatabase(requireEnv('MONGO_CONNECTION_STRING'));


import fs from 'fs';

const reports: AnomalyReport[] = [];

anomalyCheckAll(report => {
    if (report.visits.length > 0 || report.events.length > 0 || report.dns.length > 0) {
        reports.push(report);
    }
}).then(e => {
    fs.writeFileSync('security-report.json', JSON.stringify(reports));
});