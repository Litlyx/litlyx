
import { ApiSettingsModel, TApiSettings } from '@schema/ApiSettingsSchema';
import { EventModel } from '@schema/metrics/EventSchema';
import { VisitModel } from '@schema/metrics/VisitSchema';
import type { H3Event, EventHandlerRequest } from 'h3'

export function checkAuthorization(event: H3Event<EventHandlerRequest>) {
    const authorization = getHeader(event, 'Authorization');
    if (!authorization) return setResponseStatus(event, 403, 'Authorization is required');

    const [type, token] = authorization.split(' ');
    if (type != 'Bearer') return setResponseStatus(event, 401, 'Malformed authorization');

    return token;
}

export type CheckApiKeyResult = { ok: false } | { ok: true, data: TApiSettings };

export async function checkApiKey(apiKey: string): Promise<CheckApiKeyResult> {
    const apiSettings = await ApiSettingsModel.findOne({ apiKey });
    if (!apiSettings) return { ok: false }
    return { ok: true, data: apiSettings }
}

async function incrementApiUsage(apiKey: string, value: number) {
    await ApiSettingsModel.updateOne({ apiKey }, { $inc: { usage: value } });
}

async function checkApiUsage(apiKey: string) {
    const data = await ApiSettingsModel.findOne({ apiKey }, { usage: 1 });
    if (!data) return false;
    if (data.usage > 100000) return false;
    return true;
}

export type ApiResult = { ok: true, data: any } | { ok: false, code: number, error: string }

export async function eventsListApi(apiKey: string, project_id: string, rows: string[], limit?: number | string, from?: string, to?: string): Promise<ApiResult> {

    const canMakeRequest = await checkApiUsage(apiKey);

    if (!canMakeRequest) return { ok: false, code: 429, error: 'Api limit reached (100.000)' }

    const projection = Object.fromEntries(rows.map(e => [e, 1]));

    const limitNumber = parseInt((limit?.toString() as string));
    const limitValue = isNaN(limitNumber) ? 100 : limitNumber;

    const events = await EventModel.find({
        project_id,
        created_at: {
            $gte: from || new Date(2023, 0),
            $lte: to || new Date(3000, 0)
        }
    }, { _id: 0, ...projection }, { limit: limitValue });

    await incrementApiUsage(apiKey, events.length);

    return { ok: true, data: events.map(e => e.toJSON()) }

}

export async function visitsListApi(apiKey: string, project_id: string, rows: string[], limit?: number | string, from?: string, to?: string): Promise<ApiResult> {

    const canMakeRequest = await checkApiUsage(apiKey);

    if (!canMakeRequest) return { ok: false, code: 429, error: 'Api limit reached (100.000)' }

    const projection = Object.fromEntries(rows.map(e => [e, 1]));

    const limitNumber = parseInt((limit?.toString() as string));
    const limitValue = isNaN(limitNumber) ? 100 : limitNumber;

    const visits = await VisitModel.find({
        project_id,
        created_at: {
            $gte: from || new Date(2023, 0),
            $lte: to || new Date(3000, 0)
        }
    }, { _id: 0, ...projection }, { limit: limitValue });

    await incrementApiUsage(apiKey, visits.length);

    return { ok: true, data: visits.map(e => e.toJSON()) };

}