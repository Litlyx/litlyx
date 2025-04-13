import mongoose from "mongoose";
import { Redis } from "~/server/services/CacheService";
import { logger } from "./Logger";



const config = useRuntimeConfig();
let connection: mongoose.Mongoose;


export default async () => {

    logger.info('[SERVER] Initializing');

    if (!connection || connection.connection.readyState == mongoose.ConnectionStates.disconnected) {
        logger.info('[DATABASE] Connecting');
        connection = await mongoose.connect(config.MONGO_CONNECTION_STRING);
        logger.info('[DATABASE] Connected');
    }

    logger.info('[REDIS] Connecting');
    await Redis.init();
    logger.info('[REDIS] Connected');

    logger.info('[SERVER] Completed');

    logger.warn(`[SELFHOSTED_SERVER] ${config.SELFHOSTED}`);
    logger.warn(`[SELFHOSTED_CLIENT] ${config.public.SELFHOSTED}`);
    logger.warn(`[AUTH] ${config.public.AUTH_MODE}`);

};