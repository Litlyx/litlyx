
import { Router, json } from "express";
import { createSessionHash, getIPFromRequest } from "../../utils/Utils";
import { checkProjectCount } from "@functions/UtilsProjectCounts";

import { SessionModel } from "@schema/metrics/SessionSchema";
import { EVENT_LOG_LIMIT_PERCENT } from '@data/broker/Limits';
import { EventType } from '@data/broker/EventType';
import { lookup } from "../../lookup";
import { UAParser } from "ua-parser-js";
import { getDeviceFromScreenSize } from "../../ScreenSize";
import { VisitModel } from "@schema/metrics/VisitSchema";
import { EventModel } from "@schema/metrics/EventSchema";
import { ProjectCountModel } from "@schema/ProjectsCounts";
import { checkLimitsForEmail } from "../../Controller";

const router = Router();

const allowAnyType = () => true;
const jsonOptions = { limit: '10mb', type: allowAnyType }

router.post('/keep_alive', json(jsonOptions), async (req, res) => {
    try {

        const ip = getIPFromRequest(req);

        const { pid, website, userAgent, instant } = req.body;

        const sessionHash = createSessionHash(website, ip, userAgent);

        if (instant == true) {
            await SessionModel.updateOne({ project_id: pid, session: sessionHash, }, {
                $inc: { duration: 0 },
                updated_at: Date.now()
            }, { upsert: true });
        } else {
            await SessionModel.updateOne({ project_id: pid, session: sessionHash, }, {
                $inc: { duration: 1 },
                updated_at: Date.now()
            }, { upsert: true });
        }

        return res.sendStatus(200);

    } catch (ex) {
        console.error(ex);
        return res.status(500).json({ error: 'ERROR' });
    }
});


router.post('/metrics/push', json(jsonOptions), async (req, res) => {

    try {

        const { pid } = req.body;

        const projectCounts = await checkProjectCount(pid);

        const TOTAL_COUNT = projectCounts.events + projectCounts.visits;
        const LIMIT = projectCounts.limit;
        if ((TOTAL_COUNT * EVENT_LOG_LIMIT_PERCENT) > LIMIT) return;

        await checkLimitsForEmail(projectCounts);

        const ip = getIPFromRequest(req);

        const { type } = req.body;

        if (type === null || type === undefined) return res.status(400).json({ error: 'type is required' });
        if (typeof type !== 'number') return res.status(400).json({ error: 'type must be a number' });
        if (type < 0) return res.status(400).json({ error: 'type must be positive' });

        if (type === EventType.VISIT) {
            const { website, page, referrer, screenWidth, screenHeight, userAgent } = req.body;
            let referrerParsed;
            try {
                referrerParsed = new URL(referrer);
            } catch (ex) {
                referrerParsed = { hostname: referrer };
            }

            const geoLocation = lookup(ip);

            const userAgentParsed = UAParser(userAgent);

            const device = getDeviceFromScreenSize(screenWidth, screenHeight);

            const visit = new VisitModel({
                project_id: pid, website, page, referrer: referrerParsed.hostname,
                browser: userAgentParsed.browser.name || 'NO_BROWSER',
                os: userAgentParsed.os.name || 'NO_OS',
                device,
                continent: geoLocation[0],
                country: geoLocation[1],
            });

            await visit.save();

        } else {
            const { name, metadata } = req.body;
            let metadataObject;
            try {
                if (metadata) metadataObject = JSON.parse(metadata);
            } catch (ex) {
                metadataObject = { error: 'Error parsing metadata' }
            }

            const event = new EventModel({ project_id: pid, name, metadata: metadataObject });
            await event.save();
        }


        const fieldToInc = type === EventType.VISIT ? 'visits' : 'events';

        await ProjectCountModel.updateOne({ _id: projectCounts._id }, { $inc: { [fieldToInc]: 1 } });

        return res.sendStatus(200);

    } catch (ex) {
        console.error(ex);
        return res.status(500).json({ error: 'ERROR' });
    }
});


export default router;