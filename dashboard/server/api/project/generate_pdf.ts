
import pdfkit from 'pdfkit';

import { PassThrough } from 'node:stream';
import fs from 'fs';

import { ProjectModel, TProject } from "@schema/ProjectSchema";
import { UserSettingsModel } from "@schema/UserSettings";
import { VisitModel } from '@schema/metrics/VisitSchema';
import { EventModel } from '@schema/metrics/EventSchema';


type PDF_Data = {
    pageVisits: number, customEvents: number,
    visitsDay: number, eventsDay: number, visitsSessions: number,
    visitsSessionsDay: number
}

function formatNumberK(value: string | number, decimals: number = 1) {
    const num = parseInt(value.toString());

    if (num > 1_000_000) return (num / 1_000_000).toFixed(decimals) + ' M';
    if (num > 1_000) return (num / 1_000).toFixed(decimals) + ' K';
    return num.toFixed();

}

function createPdf(projectName: string, data: PDF_Data) {
    const pdf = new pdfkit({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    pdf.pipe(fs.createWriteStream('out.pdf'));

    // Set up fonts and colors
    pdf
        .fillColor('#ffffff')
        .rect(0, 0, pdf.page.width, pdf.page.height)
        .fill('#000000');

    // Title
    pdf
        .font('pdf_fonts/Poppins-Bold.ttf')
        .fontSize(26)
        .fillColor('#ffffff')
        .text(`Report of: ${projectName}`, 50, 50);

    // Section 1
    pdf
        .font('pdf_fonts/Poppins-SemiBold.ttf')
        .fontSize(20)
        .fillColor('#ffffff')
        .text('-> This month has seen a lot of visits!', 50, 120);

    pdf
        .image('pdf_images/d.png', 50, 160, { width: 300 })
        .font('pdf_fonts/Poppins-Bold.ttf')
        .fontSize(28)
        .fillColor('#ffffff')
        .text(`${formatNumberK(data.pageVisits, 2)}`, 400, 180)
        .text('WOW!', 400, 210);

    // Section 2
    pdf
        .font('pdf_fonts/Poppins-SemiBold.ttf')
        .fontSize(20)
        .fillColor('#ffffff')
        .text('-> There are also many recorded events!', 50, 350);

    pdf
        .image('pdf_images/c.png', 50, 390, { width: 300 })
        .font('pdf_fonts/Poppins-Bold.ttf')
        .fontSize(28)
        .fillColor('#ffffff')
        .text(`${formatNumberK(data.customEvents, 2)}`, 400, 420)
        .text('Let\'s go!', 400, 450);

    // Final section
    pdf
        .font('pdf_fonts/Poppins-SemiBold.ttf')
        .fontSize(20)
        .fillColor('#ffffff')
        .text('This report is not final, it only serves to demonstrate the potential of this tool. LitLyx will improve soon! Stay tuned!', 50, 600);

    pdf
        .font('pdf_fonts/Poppins-Regular.ttf')
        .fontSize(14)
        .fillColor('#ffffff')
        .text('Generated on litlyx.com', 50, 760);
    pdf
        .image('pdf_images/logo.png', 460, 700, { width: 100 }) // replace with the correct path to your Unsplash image

    // End PDF creation and save to file
    pdf.end();
    return pdf;
}






export default defineEventHandler(async event => {

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const currentActiveProject = await UserSettingsModel.findOne({ user_id: userData.id });
    if (!currentActiveProject) return setResponseStatus(event, 400, 'You need to select a project');

    const project_id = currentActiveProject.active_project_id;

    const project = await ProjectModel.findById(project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');




    const eventsCount = await EventModel.countDocuments({ project_id: project._id });
    const visitsCount = await VisitModel.countDocuments({ project_id: project._id });

    const sessionsVisitsCount: any[] = await VisitModel.aggregate([
        { $match: { project_id: project._id } },
        { $group: { _id: "$session" } },
        { $count: "count" }
    ]);

    const firstEventDate = await EventModel.findOne({ project_id: project._id }, { created_at: 1 }, { sort: { created_at: 1 } });
    const firstViewDate = await VisitModel.findOne({ project_id: project._id }, { created_at: 1 }, { sort: { created_at: 1 } });


    const avgEventsDay = () => {
        const days = (Date.now() - (firstEventDate?.created_at.getTime() || 0)) / 1000 / 60 / 60 / 24;
        const avg = eventsCount / Math.max(days, 1);
        return avg;
    };

    const avgVisitDay = () => {
        const days = (Date.now() - (firstViewDate?.created_at.getTime() || 0)) / 1000 / 60 / 60 / 24;
        const avg = visitsCount / Math.max(days, 1);
        return avg;
    };

    const avgVisitsSessionsDay = () => {
        const days = (Date.now() - (firstViewDate?.created_at.getTime() || 0)) / 1000 / 60 / 60 / 24;
        const avg = sessionsVisitsCount[0].count / Math.max(days, 1);
        return avg;
    };

    const pdf = createPdf(
        project.name, {
        customEvents: eventsCount,
        eventsDay: avgEventsDay(),
        pageVisits: visitsCount,
        visitsDay: avgVisitDay(),
        visitsSessions: sessionsVisitsCount[0].count,
        visitsSessionsDay: avgVisitsSessionsDay()
    });

    const passThrough = new PassThrough();
    pdf.pipe(passThrough);
    await sendStream(event, passThrough);
});