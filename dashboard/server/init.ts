import mongoose from "mongoose";
import { Redis } from "~/server/services/CacheService";
import EmailService from '@services/EmailService';
import StripeService from '~/server/services/StripeService';
import { anomalyLoop } from "./services/AnomalyService";

const config = useRuntimeConfig();
let connection: mongoose.Mongoose;


let anomalyMinutesCount = 0;
function anomalyCheck() {

}

export default async () => {

    console.log('[SERVER] Initializing');

    if (config.EMAIL_SERVICE) {
        EmailService.init(config.BREVO_API_KEY);
        console.log('[EMAIL] Initialized')
    }


    if (config.STRIPE_SECRET) {
        StripeService.init(config.STRIPE_SECRET, config.STRIPE_WH_SECRET, false);
        console.log('[STRIPE] Initialized')
    } else {
        StripeService.disable();
        console.log('[STRIPE] No stripe key - Disabled mode')
    }


    if (!connection || connection.connection.readyState == mongoose.ConnectionStates.disconnected) {
        console.log('[DATABASE] Connecting');
        connection = await mongoose.connect(config.MONGO_CONNECTION_STRING);
        console.log('[DATABASE] Connected');
    }

    console.log('[REDIS] Connecting');
    await Redis.init();
    console.log('[REDIS] Connected');

    console.log('[SERVER] Completed');

    console.log('[ANOMALY LOOP] Started');
    anomalyLoop();

};