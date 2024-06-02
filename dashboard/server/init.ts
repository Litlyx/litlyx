import mongoose from "mongoose";
import { Redis } from "~/server/services/CacheService";
import EmailService from '@services/EmailService';

const config = useRuntimeConfig();
let connection: mongoose.Mongoose;

export default async () => {

    console.log('[SERVER] Initializing');

    EmailService.createTransport(
        config.EMAIL_SERVICE,
        config.EMAIL_HOST,
        config.EMAIL_USER,
        config.EMAIL_PASS,
    );


    if (!connection || connection.connection.readyState == mongoose.ConnectionStates.disconnected) {
        console.log('[DATABASE] Connecting');
        connection = await mongoose.connect(config.MONGO_CONNECTION_STRING);
        console.log('[DATABASE] Connected');
    }

    console.log('[REDIS] Connecting');
    await Redis.init();
    console.log('[REDIS] Connected');

    console.log('[SERVER] Completed');

};