import { Redis } from "~/server/services/CacheService";

export default defineNitroPlugin(async nitroApp => {
    try {
        await Redis.init();
        console.log('Cache connected')
    } catch (ex) {
        console.error(ex);
    }
})