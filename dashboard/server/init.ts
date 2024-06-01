import mongoose from "mongoose";
import { Redis } from "~/server/services/CacheService";
const config = useRuntimeConfig();
let connection: mongoose.Mongoose;

export default async () => {

    console.log('[SERVER] Initializing');

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