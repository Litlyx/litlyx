import { logger } from "../Logger"


export default defineEventHandler(async (event) => {

    const ip = getRequestAddress(event);
    const user = getRequestUser(event);

    event.node.res.on('finish', () => {
        if (!event.context['performance-start']) return;
        const start = parseInt(event.context['performance-start']);
        if (isNaN(start)) return;

        const end = Date.now();
        const duration = (end - start);

        if (!user) {
            logger.debug('Request without user', { path: event.path, method: event.method, ip, duration });
        } else if (!user.logged) {
            logger.debug('Request as guest', { path: event.path, method: event.method, ip, duration });
        } else {
            logger.debug(`(${duration}ms) [${event.method}] ${event.path} { ${user.user.email} }`, { ip });
        }

        // event.node.res.setHeader('X-Total-Response-Time', `${duration.toFixed(2)} ms`);
    });

})