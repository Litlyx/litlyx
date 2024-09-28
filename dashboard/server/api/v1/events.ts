
import { checkApiKey, checkAuthorization, eventsListApi, } from '~/server/services/ApiService';
import { useCors } from '~/server/utils/useCors';


export default defineEventHandler(async event => {

    if (useCors(event)) return '';

    const { row, from, to, limit } = getQuery(event);

    const token = checkAuthorization(event);
    if (!token) return;

    const apiKeyResult = await checkApiKey(token);
    if (!apiKeyResult.ok) return setResponseStatus(event, 401, 'ApiKey not valid');

    if (Array.isArray(from)) return setResponseStatus(event, 400, 'Only one "from" is allowed');
    if (Array.isArray(to)) return setResponseStatus(event, 400, 'Only one "to" is allowed');

    const rows: string[] = Array.isArray(row) ? row as string[] : [row as string];

    const result = await eventsListApi(apiKeyResult.data.apiKey, apiKeyResult.data.project_id.toString(), rows, limit as string, from as string, to as string);

    if (result.ok) return result;
    return setResponseStatus(event, result.code, result.error);

});