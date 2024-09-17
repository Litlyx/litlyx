import { logger } from "../Logger"


export default defineEventHandler(async (event) => {
    const start = Date.now();
    event.context['performance-start'] = start.toString();
});