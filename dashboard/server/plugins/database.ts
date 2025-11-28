import mongoose, { Types } from "mongoose";
import { VisitModel } from "~/shared/schema/metrics/VisitSchema";
import fs from 'fs';

const config = useRuntimeConfig();

export default defineNitroPlugin(async nitroApp => {
    try {
        await mongoose.connect(config.MONGO_CONNECTION_STRING);
        console.log('Database connected')
    } catch (ex) {
        console.error(ex);
    }
})