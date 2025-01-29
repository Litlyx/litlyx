import mongoose from "mongoose";
import { Redis } from "~/server/services/CacheService";
import StripeService from '~/server/services/StripeService';
import { logger } from "./Logger";



const config = useRuntimeConfig();
let connection: mongoose.Mongoose;


export default async () => {

    logger.info('[SERVER] Initializing');

    if (config.STRIPE_SECRET) {
        StripeService.init(config.STRIPE_SECRET, config.STRIPE_WH_SECRET, false);
        logger.info('[STRIPE] Initialized');
    } else {
        StripeService.disable();
        logger.warn('[STRIPE] No stripe key - Disabled mode');
    }


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