import { anomalyLoop } from "./AnomalyService";
import { connectDatabase } from '@services/DatabaseService'
import { requireEnv } from '@utils/requireEnv'

import EmailService from "@services/EmailService";

import { ProjectModel } from "@schema/ProjectSchema";
import { UserModel } from "@schema/UserSchema";

EmailService.init(requireEnv('BREVO_API_KEY'));
connectDatabase(requireEnv('MONGO_CONNECTION_STRING'));


anomalyLoop(async report => {
    if (report.visits.length > 0 || report.events.length > 0 || report.dns.length > 0) {
        const project = await ProjectModel.findById(report.pid);
        if (!project) return { ok: false, error: 'Cannot find project with id ' + report.pid.toString() }
        const user = await UserModel.findById(project.owner);
        if (!user) return { ok: false, error: 'Cannot find user with id ' + project.owner.toString() }
        if (report.visits.length > 0 || report.events.length > 0) {
            await EmailService.sendAnomalyVisitsEventsEmail(user.email, project.name, { visits: report.visits, events: report.events });
        }
        if (report.visits.length > 0) {
            await EmailService.sendAnomalyDomainEmail(user.email, project.name, report.dns);
        }
    }
})