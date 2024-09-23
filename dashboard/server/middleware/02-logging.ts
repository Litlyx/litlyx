import { logger } from "../Logger"


export default defineEventHandler(async (event) => {

    const ip = getRequestAddress(event);
    const user = getRequestUser(event);

    let payload: any | undefined;

    const headers = getHeaders(event);

    const xHeaders = Object.keys(headers)
        .filter(e => e.startsWith('x-') && !e.startsWith("x-forwarded"))
        .map(e => ({ [e]: headers[e] }));


    if (event.method === 'POST' || event.method === 'DELETE') {
        payload = await readBody(event)
    }


    event.node.res.on('finish', async () => {
        if (!event.context['performance-start']) return;
        const start = parseInt(event.context['performance-start']);
        if (isNaN(start)) return;

        const end = Date.now();
        const duration = (end - start);

        if (!user) {
            logger.debug('Request without user', { path: event.path, method: event.method, ip, duration, xHeaders, payload });
        } else if (!user.logged) {
            logger.debug('Request as guest', { path: event.path, method: event.method, ip, duration, xHeaders, payload });
        } else {
            logger.debug(`(${duration}ms) [${event.method}] ${event.path} { ${user.user.email} }`, { ip, duration, xHeaders, payload });
        }

        // event.node.res.setHeader('X-Total-Response-Time', `${duration.toFixed(2)} ms`);
    });

})