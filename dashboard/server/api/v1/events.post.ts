
import { checkApiKey, checkAuthorization, eventsListApi } from '~/server/services/ApiService';
import { useCors } from '~/server/utils/useCors';


export default defineEventHandler(async event => {

    useCors(event);

    const { rows, from, to, limit } = await readBody(event);

    const token = checkAuthorization(event);
    if (!token) return;

    const apiKeyResult = await checkApiKey(token);
    if (!apiKeyResult.ok) return setResponseStatus(event, 401, 'ApiKey not valid');

    if (!rows) return setResponseStatus(event, 400, 'rows is required');
    if (!Array.isArray(rows)) return setResponseStatus(event, 400, 'rows must be an array');
    if (rows.length == 0) return setResponseStatus(event, 400, 'rows cannot be empty');

    if (Array.isArray(from)) return setResponseStatus(event, 400, 'Only one "from" is allowed');
    if (Array.isArray(to)) return setResponseStatus(event, 400, 'Only one "to" is allowed');

    const result = await eventsListApi(apiKeyResult.data.apiKey, apiKeyResult.data.project_id.toString(), rows, limit as string, from as string, to as string);

    if (result.ok) return result;
    return setResponseStatus(event, result.code, result.error);

});