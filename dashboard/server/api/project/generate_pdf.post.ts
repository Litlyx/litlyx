
import pdfkit from 'pdfkit';
import { PassThrough } from 'node:stream';

import { ProjectModel } from "@schema/project/ProjectSchema";
import { VisitModel } from '@schema/metrics/VisitSchema';
import { EventModel } from '@schema/metrics/EventSchema';

import { zodResponseFormat } from 'openai/helpers/zod';
import z from 'zod';
import { AiService } from '~/server/services/ai/AiService';


const ZPromptResponse = z.object({
    report: z.string({ description: 'Short, user-facing report summarizing website analytics data. Should be professional but slightly discursive, not just a list of stats, feel like a human summary — similar to an executive update. Highlight key numbers and insights (like visits, top countries, referrers). Use just text, no markdown. Max 620 chars.' }),
    insights: z.string({ description: 'Growth hacker, product expert and marketing expert. Simple and effective actionable insights. Max 3. Short.' }).array()
})

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
    customization: { theme: string, logo?: string },
    naturalText: string,
    insights: string[]
}

function formatNumberK(value: string | number, decimals: number = 1) {
    const num = parseInt(value.toString());

    if (num > 1_000_000) return (num / 1_000_000).toFixed(decimals) + ' M';
    if (num > 1_000) return (num / 1_000).toFixed(decimals) + ' K';
    return num.toFixed();

}

const LINE_SPACING = 0.5;

function getResourcePath() {
    if (isSelfhosted()) return '/home/app/public/pdf/';
    return process.dev ? './public/pdf/' : './.output/public/pdf/';
}

const resourcePath = getResourcePath();

function createPdf(data: PDFGenerationData) {

    const pdf = new pdfkit({
        size: 'A4',
        margins: {
            top: 30, bottom: 30, left: 50, right: 50
        },
    });

    let bgColor = '#0A0A0A';
    let textColor = '#FFFFFF';
    let logo = data.customization.logo ? Buffer.from(data.customization.logo.split(',')[1], 'base64') :
        (data.customization.theme === 'white' ? (resourcePath + 'pdf_images/logo-black.png') : (resourcePath + 'pdf_images/logo-white.png'))

    bgColor = data.customization.theme === 'white' ? '#FFFFFF' : '#0A0A0A';
    textColor = data.customization.theme === 'white' ? '#000000' : '#FFFFFF';

    pdf.fillColor(bgColor).rect(0, 0, pdf.page.width, pdf.page.height).fill(bgColor);

    pdf.font(resourcePath + 'pdf_fonts/Poppins-Bold.ttf').fontSize(16).fillColor(textColor);

    pdf.text(`Report for: ${data.projectName} project`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.moveDown(LINE_SPACING)
    pdf.font(resourcePath + 'pdf_fonts/Poppins-Bold.ttf').fontSize(13).fillColor(textColor);
    pdf.text(`Timeframe name: ${data.snapshotName}`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.font(resourcePath + 'pdf_fonts/Poppins-Regular.ttf').fontSize(12).fillColor(textColor)

    pdf.text(`${data.naturalText}`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.moveDown(LINE_SPACING)
    pdf.font(resourcePath + 'pdf_fonts/Poppins-Bold.ttf').fontSize(13).fillColor(textColor);
    pdf.text(`Plain metrics:`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.font(resourcePath + 'pdf_fonts/Poppins-Regular.ttf').fontSize(12).fillColor(textColor)

    pdf.text(`Total visits: ${data.totalVisits}`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`Average visits per day: ${data.avgVisitsDay}`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`Total events: ${data.totalEvents}`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`Top domain: ${data.topDomain}`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.text(`Top device: ${data.topDevice}`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.text(`Top 3 countries: ${data.topCountries.join(', ')}`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.text(`Top 3 best acquisition channels (referrers): ${data.topReferrers.join(', ')}`, { align: 'left' }).moveDown(LINE_SPACING);

    pdf.moveDown(LINE_SPACING)
    pdf.font(resourcePath + 'pdf_fonts/Poppins-Bold.ttf').fontSize(13).fillColor(textColor);
    pdf.text(`Actionable insights:`, { align: 'left' }).moveDown(LINE_SPACING);
    pdf.font(resourcePath + 'pdf_fonts/Poppins-Regular.ttf').fontSize(12).fillColor(textColor)


    for (let i = 0; i < data.insights.length; i++) {
        pdf.text(`• ${data.insights[i]}`, { align: 'left' }).moveDown(LINE_SPACING);
    }

    pdf.font(resourcePath + 'pdf_fonts/Poppins-Regular.ttf')
        .fontSize(10)
        .fillColor(textColor)
        .text(`Created with Litlyx.com, ${new Date().toLocaleDateString('en-US')}`, 50, 780, { align: 'left' });


    pdf.image(logo, 465, 695, { width: 85 });


    pdf.end();
    return pdf;
}


export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'range');

    const { from, to } = ctx;

    const { theme } = getQuery(event);

    const body = await readBody(event);

    const project = await ProjectModel.findById(ctx.project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    const eventsCount = await EventModel.countDocuments({
        project_id: project._id,
        created_at: { $gte: new Date(from), $lte: new Date(to) }
    });

    const visitsCount = await VisitModel.countDocuments({
        project_id: project._id,
        created_at: { $gte: new Date(from), $lte: new Date(to) }
    });

    const avgVisitDay = () => {
        const days = (Date.now() - (from)) / 1000 / 60 / 60 / 24;
        const avg = visitsCount / Math.max(days, 1);
        return avg;
    };

    const topDevices = await VisitModel.aggregate([
        { $match: { project_id: project._id, created_at: { $gte: new Date(from), $lte: new Date(to) } } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const topDevice = topDevices?.[0]?._id || 'Not enough data';

    const topDomains = await VisitModel.aggregate([
        { $match: { project_id: project._id, created_at: { $gte: new Date(from), $lte: new Date(to) } } },
        { $group: { _id: "$website", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const topDomain = topDomains?.[0]?._id || 'Not enough data';

    const topCountries = await VisitModel.aggregate([
        { $match: { project_id: project._id, created_at: { $gte: new Date(from), $lte: new Date(to) } } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
    ]);

    const topReferrers = await VisitModel.aggregate([
        { $match: { project_id: project._id, created_at: { $gte: new Date(from), $lte: new Date(to) } } },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
    ]);

    const textData: Omit<PDFGenerationData, 'naturalText' | 'insights' | 'customization'> = {
        projectName: project.name,
        snapshotName: body.snapshotName || 'NO_NAME',
        totalVisits: formatNumberK(visitsCount),
        avgVisitsDay: formatNumberK(avgVisitDay()) + '/day',
        totalEvents: formatNumberK(eventsCount),
        topDevice: topDevice,
        topDomain: topDomain,
        topCountries: topCountries.map(e => e._id),
        topReferrers: topReferrers.map(e => e._id),
    }

    const openai = AiService.init();

    const res = await openai.chat.completions.create({
        messages: [
            {
                role: 'user', content: `${JSON.stringify(textData)}`,
            }
        ],
        response_format: zodResponseFormat(ZPromptResponse, 'response'),
        model: 'gpt-4o-mini'
    })


    const resObject = JSON.parse(res.choices[0].message.content ?? '{}');
    // const resObject = { report: '', insights: [''] };

    const pdf = createPdf({
        ...textData, naturalText: resObject.report, insights: resObject.insights,
        customization: {
            theme: (theme ?? 'black') as string,
            logo: body.customLogo
        },
    });

    const passThrough = new PassThrough();
    pdf.pipe(passThrough);
    await sendStream(event, passThrough);
});