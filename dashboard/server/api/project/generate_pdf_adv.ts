import { ProjectModel, TProject } from "~/shared/schema/project/ProjectSchema";
import puppeteer from 'puppeteer'
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from "path";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import { formatNumberK, formatTime } from "~/utils/numberFormatter";
import { visitController } from "~/server/controllers/VisitController";
import { durationController } from "~/server/controllers/DurationController";
import { bouncingController } from "~/server/controllers/BouncingController";
import { AiService } from "~/server/services/ai/AiService";
import referrers from "../data/referrers";


type BaseOptions = {
    target: TProject,
    resourcesPath: string,
    domain: string,
    from: Date,
    to: Date,
    customLogo: string
}

function getDistribution(array: any[], key: string, current: number) {
    const count = array.reduce((a, e) => a + e[key], 0);
    return (100 / count * array[current][key]).toFixed(2);
}

export async function getPage1(options: BaseOptions) {

    const page1_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page1.html'), 'utf-8');
    const page1 = page1_raw
        .replace('%PROJECT_NAME%', options.target.name)
        .replace('%DOMAIN%', options.domain)
        .replace('%FROM%', options.from.toLocaleString())
        .replace('%TO%', options.to.toLocaleString())
        .replace('%LOGO%', options.customLogo)
    return page1;
}

export async function getPage2(options: BaseOptions) {
    const page2_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page2.html'), 'utf-8');

    const [visit_count, session_count, pages, countries, devices, referrers, session_duration, bouncing_rate] = await Promise.all([
        VisitModel.countDocuments({
            project_id: options.target._id,
            created_at: {
                $gte: options.from,
                $lte: options.to
            },
            website: options.domain
        }),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            {
                $group: {
                    _id: null,
                    uniqueSessions: { $addToSet: "$session" }
                }
            },
            {
                $project: {
                    _id: 0,
                    uniqueSessionCount: { $size: "$uniqueSessions" }
                }
            }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $group: { _id: "$page", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $group: { _id: "$country", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: {
                        $gte: options.from,
                        $lte: options.to
                    },
                    website: options.domain
                }
            },
            { $group: { _id: "$device", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: {
                        $gte: options.from,
                        $lte: options.to
                    },
                    website: options.domain
                }
            },
            { $group: { _id: "$referrer", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
        durationController.executeDynamic({
            project_id: options.target._id.toString(),
            from: options.from.getTime(), to: options.to.getTime(),
            slice: 'day', domain: options.domain
        }),
        await bouncingController.executeDynamic({
            project_id: options.target._id.toString(),
            from: options.from.getTime(), to: options.to.getTime(),
            slice: 'day', domain: options.domain
        })
    ]);



    const ai = AiService.init();


    const data: any[] = [
        `- Visits: ${visit_count}`,
        `- Sessions: ${session_count[0].uniqueSessionCount}`,
        `- Most viewed pages: ${JSON.stringify(pages)}`,
        `- Most viewed from countries: ${JSON.stringify(countries)}`,
        `- Most viewed from devices: ${JSON.stringify(devices)}`,
        `- Date of analytics: ${options.from.toISOString()} to ${options.to.toISOString()}`,
        `- Domain of analytics: ${options.domain}`,
    ]

    const aiResponse = await ai.responses.create({
        model: 'gpt-5-nano',
        input: `Generate an insight of the current website analytics data (max 600 characters):\n${data.join('\n')}`
    })



    const page2 = page2_raw
        .replace('%VISITS%', formatNumberK(visit_count ?? 0, 1))
        .replace('%SESSIONS%', formatNumberK(session_count[0].uniqueSessionCount ?? 0, 1))
        .replace('%BOUNCING_RATE%', (bouncing_rate.data.reduce((a, e) => a + e.count, 0) / bouncing_rate.data.length).toFixed(2) + '%')
        .replace('%SESSION_DURATION%', formatTime(session_duration.data.reduce((a, e) => a + e.count, 0) * 1000))

        .replace('%PAGE_0%', pages[0]?._id)
        .replace('%PAGE_1%', pages[1]?._id)
        .replace('%PAGE_2%', pages[2]?._id)

        .replace('%COUNTRY_0%', countries[0]?._id)
        .replace('%COUNTRY_1%', countries[1]?._id)
        .replace('%COUNTRY_2%', countries[2]?._id)

        .replace('%DEVICE_0%', devices[0]?._id)
        .replace('%DEVICE_1%', devices[1]?._id)
        .replace('%DEVICE_2%', devices[2]?._id)

        .replace('%REFERRER_0%', referrers[0]?._id)
        .replace('%REFERRER_1%', referrers[1]?._id)
        .replace('%REFERRER_2%', referrers[2]?._id)

        .replace('%AI_0%', aiResponse.output_text)

        .replace('%LOGO%', options.customLogo)

    return page2;
}


export async function getPage3(options: BaseOptions) {

    const page3_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page3.html'), 'utf-8');

    const [visits, sessions, devices, visits_timeline] = await Promise.all([
        VisitModel.countDocuments({
            project_id: options.target._id,
            created_at: {
                $gte: options.from,
                $lte: options.to
            },
            website: options.domain
        }),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: {
                        $gte: options.from,
                        $lte: options.to
                    },
                    website: options.domain
                }
            },
            { $group: { _id: "$session" } },
            { $count: "count" }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: {
                        $gte: options.from,
                        $lte: options.to
                    },
                    website: options.domain
                }
            },
            { $group: { _id: "$device", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
        visitController.executeDynamic({
            project_id: options.target._id.toString(),
            from: options.from.getTime(), to: options.to.getTime(),
            slice: 'day', domain: options.domain
        })
    ]);


    const ai = AiService.init();

    const [ai0, ai1] = await Promise.all([
        ai.responses.create({
            model: 'gpt-5-nano',
            input: `Generate an insight of the current website analytics data (max 220 characters):\n- Visits: ${JSON.stringify(visits)}\n- Sessions: ${JSON.stringify(sessions)}`
        }),
        ai.responses.create({
            model: 'gpt-5-nano',
            input: `Generate an insight of the current website analytics data (max 500 characters):\n- Visits: ${JSON.stringify(visits_timeline)}`
        })
    ])

    const page3 = page3_raw
        .replace('%VISITS%', visits.toString())
        .replace('%SESSIONS%', sessions[0].count)
        .replace('%DEVICE_0%', `${devices[0]._id} - ${devices[0].count}`)
        .replace('%DEVICE_1%', `${devices[1]._id} - ${devices[1].count}`)
        .replace('%DEVICE_2%', `${devices[2]._id} - ${devices[2].count}`)

        .replace('VAR_LABELS_TRAFFIC', `[${visits_timeline.data.map(e => `"${e.count}"`).join(',')}]`)
        .replace('VAR_DATA_TRAFFIC', `[${visits_timeline.data.map(e => e.count).join(',')}]`)

        .replace('VAR_LABELS_PIE', `[${devices.map(e => `"${e._id}"`).join(',')}]`)
        .replace('VAR_DATA_PIE', `[${devices.map(e => e.count).join(',')}]`)

        .replace('%AI_0%', ai0.output_text)
        .replace('%AI_1%', ai1.output_text)

        .replace('%LOGO%', options.customLogo)

    return page3;
}

export async function getPage4(options: BaseOptions) {

    const page4_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page4.html'), 'utf-8');

    const [referrers, utm_sources, utm_campaign, utm_medium] = await Promise.all([
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $group: { _id: "$referrer", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain,
                    utm_source: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$utm_source',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain,
                    utm_campaign: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$utm_campaign',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain,
                    utm_medium: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$utm_medium',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ])
    ]);

    const ai = AiService.init();

    const [ai0, ai1, ai2, ai3] = await Promise.all([
        ai.responses.create({
            model: 'gpt-5-nano',
            input: `Generate an insight of the current website analytics data (max 220 characters):\n- Referrers: ${JSON.stringify(referrers)}`
        }),
        ai.responses.create({
            model: 'gpt-5-nano',
            input: `Generate an insight of the current website analytics data (max 220 characters):\n- utm_sources: ${JSON.stringify(utm_sources)}`
        }),
        ai.responses.create({
            model: 'gpt-5-nano',
            input: `Generate an insight of the current website analytics data (max 220 characters):\n- utm_campaign: ${JSON.stringify(utm_campaign)}`
        }),
        ai.responses.create({
            model: 'gpt-5-nano',
            input: `Generate an insight of the current website analytics data (max 220 characters):\n- utm_medium: ${JSON.stringify(utm_medium)}`
        })
    ])


    const page4 = page4_raw
        .replace('%REFERRER_0%', `${referrers[0]._id} - ${referrers[0].count}`)
        .replace('%REFERRER_1%', `${referrers[1]._id} - ${referrers[1].count}`)
        .replace('%REFERRER_2%', `${referrers[2]._id} - ${referrers[2].count}`)
        .replace('%REFERRER_3%', `${referrers[3]._id} - ${referrers[3].count}`)
        .replace('%REFERRER_4%', `${referrers[4]._id} - ${referrers[4].count}`)

        .replace('%UTMSOURCE_0%', `${utm_sources[0]?._id} -> ${utm_sources[0]?.count}`)
        .replace('%UTMSOURCE_1%', `${utm_sources[1]?._id} -> ${utm_sources[1]?.count}`)
        .replace('%UTMSOURCE_2%', `${utm_sources[2]?._id} -> ${utm_sources[2]?.count}`)

        .replace('%UTMCAMPAIGN_0%', `${utm_campaign[0]?._id} -> ${utm_campaign[0]?.count}`)
        .replace('%UTMCAMPAIGN_1%', `${utm_campaign[1]?._id} -> ${utm_campaign[1]?.count}`)
        .replace('%UTMCAMPAIGN_2%', `${utm_campaign[2]?._id} -> ${utm_campaign[2]?.count}`)

        .replace('%UTMMEDIUM_0%', `${utm_medium[0]?._id} -> ${utm_medium[0]?.count}`)
        .replace('%UTMMEDIUM_1%', `${utm_medium[1]?._id} -> ${utm_medium[1]?.count}`)
        .replace('%UTMMEDIUM_2%', `${utm_medium[2]?._id} -> ${utm_medium[2]?.count}`)

        .replace('%AI_0%', ai0.output_text)
        .replace('%AI_1%', ai1.output_text)
        .replace('%AI_2%', ai2.output_text)
        .replace('%AI_3%', ai3.output_text)


        .replace('%LOGO%', options.customLogo)

    return page4;
}

export async function getPage5(options: BaseOptions) {

    const page5_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page5.html'), 'utf-8');

    const [referrers, utm_term, utm_content] = await Promise.all([
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $group: { _id: "$referrer", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain,
                    utm_term: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$utm_term',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain,
                    utm_content: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$utm_content',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]),
    ]);

    const ai = AiService.init();

    const [ai0, ai1] = await Promise.all([
        ai.responses.create({
            model: 'gpt-5-nano',
            input: `Generate an insight of the current website analytics data (max 220 characters):\n- utm_term: ${JSON.stringify(utm_term)}`
        }),
        ai.responses.create({
            model: 'gpt-5-nano',
            input: `Generate an insight of the current website analytics data (max 220 characters):\n- utm_content: ${JSON.stringify(utm_content)}`
        }),
    ])


    let page5 = page5_raw

    for (let i = 0; i < 5; i++) {
        page5 = page5.replace(`%REFERRER_${i}_NAME%`, `${referrers[i]?._id}`)
            .replace(`%REFERRER_${i}_COUNT%`, `${referrers[i]?.count}`)
            .replace(`%REFERRER_${i}_PERCENT%`, `${getDistribution(referrers, 'count', i)} %`)
    }

    page5 = page5.replace(`%UTMTERM_0%`, `${utm_term[0]?._id} → ${utm_term[0]?.count}`)
    page5 = page5.replace(`%UTMTERM_1%`, `${utm_term[1]?._id} → ${utm_term[1]?.count}`)
    page5 = page5.replace(`%UTMTERM_2%`, `${utm_term[2]?._id} → ${utm_term[2]?.count}`)
    page5 = page5.replace(`%UTMCONTENT_0%`, `${utm_content[0]?._id} → ${utm_content[0]?.count}`)
    page5 = page5.replace(`%UTMCONTENT_1%`, `${utm_content[1]?._id} → ${utm_content[1]?.count}`)
    page5 = page5.replace(`%UTMCONTENT_2%`, `${utm_content[2]?._id} → ${utm_content[2]?.count}`)

    page5 = page5.replace(`%AI_0%`, ai0.output_text)
    page5 = page5.replace(`%AI_1%`, ai1.output_text)

    return page5;
}

export async function getPage6(options: BaseOptions) {
    const page6_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page6.html'), 'utf-8');

    const [pages, entry_pages, exit_pages] = await Promise.all([
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $group: { _id: "$page", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $sort: { session: 1, created_at: 1 } },
            { $group: { _id: "$session", entryPage: { $first: "$page" } } },
            { $group: { _id: "$entryPage", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $sort: { session: 1, created_at: 1 } },
            { $group: { _id: "$session", exitPage: { $last: "$page" } } },
            { $group: { _id: "$exitPage", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ])
    ])

    const page6 = page6_raw
        .replace('%PAGE_0%', `${pages[0]?._id} → ${pages[0]?.count}`)
        .replace('%PAGE_1%', `${pages[1]?._id} → ${pages[1]?.count}`)
        .replace('%PAGE_2%', `${pages[2]?._id} → ${pages[2]?.count}`)
        .replace('%PAGE_3%', `${pages[3]?._id} → ${pages[3]?.count}`)
        .replace('%PAGE_4%', `${pages[4]?._id} → ${pages[4]?.count}`)

        .replace('%ENTRY_PAGE_0%', `${entry_pages[0]?._id} → ${entry_pages[0]?.count}`)
        .replace('%ENTRY_PAGE_1%', `${entry_pages[1]?._id} → ${entry_pages[1]?.count}`)
        .replace('%ENTRY_PAGE_2%', `${entry_pages[2]?._id} → ${entry_pages[2]?.count}`)
        .replace('%ENTRY_PAGE_3%', `${entry_pages[3]?._id} → ${entry_pages[3]?.count}`)
        .replace('%ENTRY_PAGE_4%', `${entry_pages[4]?._id} → ${entry_pages[4]?.count}`)

        .replace('%EXIT_PAGE_0%', `${exit_pages[0]?._id} → ${exit_pages[0]?.count}`)
        .replace('%EXIT_PAGE_1%', `${exit_pages[1]?._id} → ${exit_pages[1]?.count}`)
        .replace('%EXIT_PAGE_2%', `${exit_pages[2]?._id} → ${exit_pages[2]?.count}`)
        .replace('%EXIT_PAGE_3%', `${exit_pages[3]?._id} → ${exit_pages[3]?.count}`)
        .replace('%EXIT_PAGE_4%', `${exit_pages[4]?._id} → ${exit_pages[4]?.count}`)

    return page6;
}

export async function getPage7(options: BaseOptions) {
    const page7_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page7.html'), 'utf-8');


    const [pages, sessions] = await Promise.all([
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            {
                $setWindowFields: {
                    partitionBy: "$session",
                    sortBy: { created_at: 1 },
                    output: {
                        nextCreatedAt: { $shift: { output: "$created_at", by: 1 } },
                        nextPage: { $shift: { output: "$page", by: 1 } }
                    }
                }
            },
            {
                $project: {
                    page: 1,
                    created_at: 1,
                    nextCreatedAt: 1,
                    durationMs: {
                        $cond: [
                            { $ne: ["$nextCreatedAt", null] },
                            { $subtract: ["$nextCreatedAt", "$created_at"] },
                            null
                        ]
                    }
                }
            },
            {
                $match: {
                    durationMs: { $ne: null, $gt: 0, $lte: 1000 * 60 * 60 * 1 }
                }
            },
            {
                $group: {
                    _id: "$page",
                    count: { $sum: 1 },
                    avgMs: { $avg: "$durationMs" }
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    avgSeconds: { $round: [{ $divide: ["$avgMs", 1000] }, 0] },
                }
            },
            { $sort: { count: -1 } },
            { $limit: 8 },
        ]),
        durationController.executeDynamic({
            project_id: options.target._id.toString(),
            from: options.from.getTime(), to: options.to.getTime(),
            slice: 'day', domain: options.domain
        })
    ])

    let page7 = page7_raw

    for (let i = 0; i < 8; i++) {
        page7 = page7
            .replace(`%ITEM_${i}_A%`, `${pages[i]?._id}`)
            .replace(`%ITEM_${i}_B%`, `${pages[i]?.count}`)
            .replace(`%ITEM_${i}_C%`, `${formatTime(pages[i]?.avgSeconds * 1000)}`)
            .replace(`%ITEM_${i}_D%`, `${getDistribution(pages, 'count', i)} %`)

            .replace(`%AVG_PAGE_TIME%`, `${formatTime((pages.reduce((a, e) => a + e.avgSeconds, 0) / pages.length) * 1000)}`)
            .replace(`%AVG_SESSION_TIME%`, `${formatTime((sessions.data.reduce((a, e) => a + e.count, 0) / sessions.data.length) * 1000)}`)

            .replace('%LOGO%', options.customLogo)
    }

    return page7;
}

export async function getPage8(options: BaseOptions) {
    const page8_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page8.html'), 'utf-8');


    const [continents, countries] = await Promise.all([
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $group: { _id: "$continent", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 4 }
        ]),
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $group: { _id: "$country", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ])
    ])

    let page8 = page8_raw

    for (let i = 0; i < 4; i++) {
        page8 = page8
            .replace(`%CONTINENT_${i}_A%`, `${continents[i]?._id}`)
            .replace(`%CONTINENT_${i}_B%`, `${continents[i]?.count}`)
            .replace(`%CONTINENT_${i}_C%`, `${getDistribution(continents, 'count', i)}%`)
    }

    for (let i = 0; i < 5; i++) {
        page8 = page8
            .replace(`%COUNTRY_${i}_A%`, `${countries[i]?._id}`)
            .replace(`%COUNTRY_${i}_B%`, `${countries[i]?.count}`)
            .replace(`%COUNTRY_${i}_C%`, `${getDistribution(countries, 'count', i)}%`)
    }

    page8 = page8.replace('%LOGO%', options.customLogo)

    return page8;
}

export async function getPage9(options: BaseOptions) {
    const page9_raw = fs.readFileSync(path.join(options.resourcesPath, 'pages/page9.html'), 'utf-8');


    const [cities] = await Promise.all([
        VisitModel.aggregate([
            {
                $match: {
                    project_id: options.target._id,
                    created_at: { $gte: options.from, $lte: options.to },
                    website: options.domain
                }
            },
            { $group: { _id: "$city", count: { $sum: 1, } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]),
    ])

    let page9 = page9_raw

    for (let i = 0; i < 5; i++) {
        page9 = page9
            .replace(`%CITY_${i}_A%`, `${cities[i]?._id ?? 'Unknown'}`)
            .replace(`%CITY_${i}_B%`, `${cities[i]?.count}`)
            .replace(`%CITY_${i}_C%`, `${getDistribution(cities, 'count', i)}%`)
    }

    page9 = page9.replace('%LOGO%', options.customLogo)

    return page9;
}



function getResourcePath() {
    if (isSelfhosted()) return '/home/app/public/pdf/';
    return process.dev ? './public/pdf/' : './.output/public/pdf/';
}

export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'pid', 'range');

    const project = await ProjectModel.findById(ctx.project_id);
    if (!project) return setResponseStatus(event, 400, 'Project not found');

    const { customLogo } = await readBody(event);

    const target = project;
    const from = new Date(ctx.from);
    const to = new Date(ctx.to);
    const query = getQuery(event);
    const domain = query.domain as string;

    const resourcesPath = getResourcePath();


    const [page1, page2, page3, page4, page5, page6, page7, page8, page9] = await Promise.all([
        getPage1({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
        getPage2({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
        getPage3({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
        getPage4({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
        getPage5({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
        getPage6({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
        getPage7({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
        getPage8({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
        getPage9({ resourcesPath, domain, from, to, target, customLogo: customLogo ?? 'https://dashboard.litlyx.com/pdf/pdf_images/logo-black.png' }),
    ])


    const CUSTOM_CHROMIUM = fs.existsSync('/usr/bin/chromium-browser');

    const browser = await puppeteer.launch({
        executablePath: CUSTOM_CHROMIUM ? '/usr/bin/chromium-browser' : undefined,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-features=site-per-process',
            '--aggressive-cache-discard',
            '--disable-cache',
            '--disable-application-cache',
            '--disable-offline-load-stale-cache',
            '--disable-gpu-shader-disk-cache',
            '--media-cache-size=0',
            '--disk-cache-size=0',
        ],
    });
    const page = await browser.newPage();

    await page.setContent(page1, { waitUntil: "load" });
    const page1buffer = await page.pdf({ format: "A4", printBackground: true });

    await page.setContent(page2, { waitUntil: "load" });
    const page2buffer = await page.pdf({ format: "A4", printBackground: true });

    await page.setContent(page3, { waitUntil: "load" });
    await new Promise(e => setTimeout(e, 1000));
    const page3buffer = await page.pdf({ format: "A4", printBackground: true });

    await page.setContent(page4, { waitUntil: "load" });
    const page4buffer = await page.pdf({ format: "A4", printBackground: true });

    await page.setContent(page5, { waitUntil: "load" });
    const page5buffer = await page.pdf({ format: "A4", printBackground: true });

    await page.setContent(page6, { waitUntil: "load" });
    const page6buffer = await page.pdf({ format: "A4", printBackground: true });

    await page.setContent(page7, { waitUntil: "load" });
    const page7buffer = await page.pdf({ format: "A4", printBackground: true });

    await page.setContent(page8, { waitUntil: "load" });
    const page8buffer = await page.pdf({ format: "A4", printBackground: true });

    await page.setContent(page9, { waitUntil: "load" });
    const page9buffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();



    const mergedPdf = await PDFDocument.create();

    const pdf1 = await PDFDocument.load(page1buffer);
    const copiedPages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
    copiedPages1.forEach((p) => mergedPdf.addPage(p));

    const pdf2 = await PDFDocument.load(page2buffer);
    const copiedPages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
    copiedPages2.forEach((p) => mergedPdf.addPage(p));

    const pdf3 = await PDFDocument.load(page3buffer);
    const copiedPages3 = await mergedPdf.copyPages(pdf3, pdf3.getPageIndices());
    copiedPages3.forEach((p) => mergedPdf.addPage(p));

    const pdf4 = await PDFDocument.load(page4buffer);
    const copiedPages4 = await mergedPdf.copyPages(pdf4, pdf4.getPageIndices());
    copiedPages4.forEach((p) => mergedPdf.addPage(p));

    const pdf5 = await PDFDocument.load(page5buffer);
    const copiedPages5 = await mergedPdf.copyPages(pdf5, pdf5.getPageIndices());
    copiedPages5.forEach((p) => mergedPdf.addPage(p));

    const pdf6 = await PDFDocument.load(page6buffer);
    const copiedPages6 = await mergedPdf.copyPages(pdf6, pdf6.getPageIndices());
    copiedPages6.forEach((p) => mergedPdf.addPage(p));

    const pdf7 = await PDFDocument.load(page7buffer);
    const copiedPages7 = await mergedPdf.copyPages(pdf7, pdf7.getPageIndices());
    copiedPages7.forEach((p) => mergedPdf.addPage(p));

    const pdf8 = await PDFDocument.load(page8buffer);
    const copiedPages8 = await mergedPdf.copyPages(pdf8, pdf8.getPageIndices());
    copiedPages8.forEach((p) => mergedPdf.addPage(p));

    const pdf9 = await PDFDocument.load(page9buffer);
    const copiedPages9 = await mergedPdf.copyPages(pdf9, pdf9.getPageIndices());
    copiedPages9.forEach((p) => mergedPdf.addPage(p));

    const finalPdfBytes = await mergedPdf.save();

    setResponseHeaders(event, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="AdvancedReport.pdf"',
    });

    return finalPdfBytes;

});