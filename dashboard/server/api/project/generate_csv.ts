
import { ProjectModel } from "@schema/ProjectSchema";
import { UserModel } from "@schema/UserSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import { EventModel } from '@schema/metrics/EventSchema';
import { VisitModel } from "@schema/metrics/VisitSchema";

import { google } from 'googleapis';

const { GOOGLE_AUTH_CLIENT_SECRET, GOOGLE_AUTH_CLIENT_ID } = useRuntimeConfig()

async function exportToGoogle(data: string, user_id: string) {

    const user = await UserModel.findOne({ _id: user_id }, { google_tokens: true });

    const authClient = new google.auth.OAuth2({
        clientId: GOOGLE_AUTH_CLIENT_ID,
        clientSecret: GOOGLE_AUTH_CLIENT_SECRET
    })

    authClient.setCredentials({ access_token: user?.google_tokens?.access_token, refresh_token: user?.google_tokens?.refresh_token });

    const sheets = google.sheets({ version: 'v4', auth: authClient });

    try {
        const createSheetResponse = await sheets.spreadsheets.create({
            requestBody: {
                properties: {
                    title: 'Text export'
                }
            }
        });

        const spreadsheetId = createSheetResponse.data.spreadsheetId;

        await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId as string,
            range: 'Sheet1!A1',
            requestBody: {
                values: data.split('\n').map(e => {
                    return e.split(',')
                })
            }
        });

        return { ok: true }

    } catch (error: any) {

        console.error('Error creating Google Sheet from CSV:', error);

        if (error.response && error.response.status === 401) {
            return { error: 'Auth error, try to logout and login again' }
        }

        return { error: error.message.toString() }

    }
}

export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    const PREMIUM_TYPE = project.premium_type;

    if (PREMIUM_TYPE === 0) return setResponseStatus(event, 400, 'Project not premium');

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



        const isGoogle = getHeader(event, 'x-google-export');

        if (isGoogle === 'true') {
            const data = await exportToGoogle(result, userData.id);
            return data;
        }

        return result;
    } else {
        return '';
    }


});