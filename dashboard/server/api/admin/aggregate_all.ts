import { eachDayOfInterval } from "date-fns";
import { executeAggregation } from "~/server/services/AggregationService";


export default defineEventHandler(async event => {

    const ctx = await getRequestContext(event, 'admin');

    const dates = eachDayOfInterval({
        start: new Date('2025-09-01T00:00:00.000Z'),
        end: new Date('2025-09-25T00:00:00.000Z')
    });

    for (const date of dates) {
        console.log(new Date().toLocaleTimeString('it-IT'), 'AGGREGATION', date);
        await executeAggregation(date);
    }

    console.log('COMPLETED')

});