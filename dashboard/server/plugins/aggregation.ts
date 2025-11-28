import { executeAggregation } from "../services/AggregationService";
import cluster from 'cluster';

export default defineNitroPlugin(async nitroApp => {
    try {

        if (!cluster.isPrimary) return console.log('NOT PRIMARY CLUSTER');
        console.log('PRIMARY CLUSTER');

        setInterval(async () => {
            const date = new Date();
            console.log(date, 'AGGREGATING');
            await executeAggregation(date);
            console.log(date, 'AGGREGATED');
        }, 1000 * 60 * 60 * 6);


    } catch (ex) {
        console.error(ex);
    }
})