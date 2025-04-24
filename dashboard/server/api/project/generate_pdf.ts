
import pdfkit from 'pdfkit';
import { PassThrough } from 'node:stream';

import { ProjectModel } from "@schema/project/ProjectSchema";
import { VisitModel } from '@schema/metrics/VisitSchema';
import { EventModel } from '@schema/metrics/EventSchema';
import { ReportCustomizationModel, TReportCustomization } from '~/shared/schema/report/ReportCustomizationSchema';


type PDFGenerationData = {
    projectName: string,
    snapshotName: string,
    totalVisits: string,
    avgVisitsDay: string,
    totalEvents: string,
    topDomain: string,
    topDevice: string,
    topCountries: string[],
    topReferrers: string[],
    avgGrowthText: string,
    customization?: TReportCustomization
}

function formatNumberK(value: string | number, decimals: number = 1) {
    const num = parseInt(value.toString());

    if (num > 1_000_000) return (num / 1_000_000).toFixed(decimals) + ' M';
    if (num > 1_000) return (num / 1_000).toFixed(decimals) + ' K';
    return num.toFixed();

}

const LINE_SPACING = 0.5;

const resourcePath = process.env.MODE === 'TEST' ? './public/pdf/' : './.output/public/pdf/';

function createPdf(data: PDFGenerationData) {

    const pdf = new pdfkit({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 }, });

    let bgColor = '#0A0A0A';
    let textColor = 'FFFFFF';
    let logo = data.customization?.logo ?? resourcePath + 'pdf_images/logo.png'

    if (data.customization?.bg) {
        bgColor = data.customization.bg === 'white' ? '#FFFFFF' : '#0A0A0A';
        textColor = data.customization.bg === 'white' ? '#000000' : '#FFFFFF';
    }



    pdf.fillColor(bgColor).rect(0, 0, pdf.page.width, pdf.page.height).fill(bgColor);

    pdf.font(resourcePath + 'pdf_fonts/Poppins-Bold.ttf').fontSize(16).fillColor(textColor);

    pdf.text(`${data.projectName}`, { align: 'center' }).moveDown(LINE_SPACING);
    pdf.text(`Timeframe name: ${data.snapshotName}`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.font(resourcePath + 'pdf_fonts/Poppins-Regular.ttf').fontSize(12).fillColor(textColor)

    pdf.text(`Total visits: ${data.totalVisits}`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`Average visits per day: ${data.avgVisitsDay}`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`Total events: ${data.totalEvents}`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`Top domain: ${data.topDomain}`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`Top device: ${data.topDevice}`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.text('Top 3 countries:', { align: 'left' }).moveDown(LINE_SPACING);
    data.topCountries.forEach((country: any) => {
        pdf.text(`• ${country}`, { align: 'left' }).moveDown(LINE_SPACING);
    });

    pdf.text('Top 3 best acquisition channels (referrers):', { align: 'left' }).moveDown(LINE_SPACING);
    data.topReferrers.forEach((channel: any) => {
        pdf.text(`• ${channel}`, { align: 'left' }).moveDown(LINE_SPACING);
    });

    pdf.text('Average growth:', { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`${data.avgGrowthText}`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.font(resourcePath + 'pdf_fonts/Poppins-Italic.ttf')
        .text('This gives you an idea of the average growth your website is experiencing over time.', { align: 'left' })
        .moveDown(LINE_SPACING);

    pdf.font(resourcePath + 'pdf_fonts/Poppins-Regular.ttf')
        .fontSize(10)
        .fillColor(textColor)
        .text('Created with Litlyx.com', 50, 760, { align: 'center' });


    pdf.image(logo, 460, 700, { width: 100 });

    pdf.end();
    return pdf;
}

export default defineEventHandler(async event => {

    const data = await getRequestDataOld(event, { requireSchema: false, allowGuests: true, requireRange: false });
    if (!data) return;

    const userData = getRequestUser(event);
    if (!userData?.logged) return setResponseStatus(event, 400, 'NotLogged');

    const project = await ProjectModel.findById(data.project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    const snapshotHeader = getHeader(event, 'x-snapshot-name');
    const fromHeader = getHeader(event, 'x-from');
    const toHeader = getHeader(event, 'x-to');

    const from = fromHeader ? new Date(fromHeader) : new Date(2020, 0);
    const to = toHeader ? new Date(toHeader) : new Date(3001, 0);

    const eventsCount = await EventModel.countDocuments({
        project_id: project._id,
        created_at: { $gte: from, $lte: to }
    });

    const visitsCount = await VisitModel.countDocuments({
        project_id: project._id,
        created_at: { $gte: from, $lte: to }
    });

    const avgVisitDay = () => {
        const days = (Date.now() - (from.getTime())) / 1000 / 60 / 60 / 24;
        const avg = visitsCount / Math.max(days, 1);
        return avg;
    };

    const topDevices = await VisitModel.aggregate([
        { $match: { project_id: project._id, created_at: { $gte: from, $lte: to } } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const topDevice = topDevices?.[0]?._id || 'Not enough data';

    const topDomains = await VisitModel.aggregate([
        { $match: { project_id: project._id, created_at: { $gte: from, $lte: to } } },
        { $group: { _id: "$website", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const topDomain = topDomains?.[0]?._id || 'Not enough data';

    const topCountries = await VisitModel.aggregate([
        { $match: { project_id: project._id, created_at: { $gte: from, $lte: to } } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
    ]);

    const topReferrers = await VisitModel.aggregate([
        { $match: { project_id: project._id, created_at: { $gte: from, $lte: to } } },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
    ]);

    const customization = await ReportCustomizationModel.findOne({ project_id: project._id });

    const pdf = createPdf({
        projectName: project.name,
        snapshotName: snapshotHeader || 'NO_NAME',
        totalVisits: formatNumberK(visitsCount),
        avgVisitsDay: formatNumberK(avgVisitDay()) + '/day',
        totalEvents: formatNumberK(eventsCount),
        avgGrowthText: 'Insufficient Data (Requires at least 2 months of tracking)',
        topDevice: topDevice,
        topDomain: topDomain,
        topCountries: topCountries.map(e => e._id),
        topReferrers: topReferrers.map(e => e._id),
        customization: customization?.toJSON() as TReportCustomization
    });

    const passThrough = new PassThrough();
    pdf.pipe(passThrough);
    await sendStream(event, passThrough);
});