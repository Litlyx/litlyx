
import { ApiSettingsModel } from '@schema/ApiSettingsSchema';
import { EventModel } from '@schema/metrics/EventSchema';

export default defineEventHandler(async event => {

    const { row, from, to, limit } = getQuery(event);

    const authorization = getHeader(event, 'Authorization');
    if (!authorization) return setResponseStatus(event, 403, 'Authorization is required');

    const [type, token] = authorization.split(' ');
    if (type != 'Bearer') return setResponseStatus(event, 401, 'Malformed authorization');

    const apiSettings = await ApiSettingsModel.findOne({ apiKey: token });
    if (!apiSettings) return setResponseStatus(event, 401, 'ApiKey not valid');

    if (!row) return setResponseStatus(event, 400, 'row is required');


    const rows: string[] = Array.isArray(row) ? row as string[] : [row as string];

    const projection: any = {};

    for (const row of rows) {
        projection[row] = 1;
    }

    const limitNumber = parseInt((limit as string));

    const limitValue = isNaN(limitNumber) ? 100 : limitNumber;

    const visits = await EventModel.find({
        project_id: apiSettings.project_id,
        created_at: {
            $gte: from || new Date(2023, 0),
            $lte: to || new Date(3000, 0)
        }
    }, { _id: 0, ...projection }, { limit: limitValue });

    return visits.map(e => e.toJSON());


});