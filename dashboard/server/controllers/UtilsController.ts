import mongoose from "mongoose";
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { Slice } from "~/shared/services/DateService";
import { AggModel } from "~/shared/schema/aggregation/AggSchema";

type BaseOptions = {
    project_id: string,
    from: number,
    to: number,
    domain?: string,
    slice: Slice
}

export type TimelineOptions = BaseOptions & {
    ignoreSliceSize?: boolean
}

export type AggregateOptions = {
    project_id: string,
    date: Date,
    override: boolean,
    domains: string[]
}



export class StandardController {
    constructor(private data_type: string, private parse: (e: any) => number) { }

    async getTimeline(options: TimelineOptions): Promise<any[]> {
        console.error('Must implement executeTimeline');
        return [];
    }

    async getAggregated(options: BaseOptions) {
        const { project_id, domain } = options;

        const from = startOfDay(new UTCDate(options.from));
        const to = endOfDay(new UTCDate(options.to));

        const aggregation: any[] = [
            {
                $match: {
                    project_id: new mongoose.Types.ObjectId(project_id),
                    data_type: this.data_type,
                    date: { $gte: from, $lte: to },
                    domain: domain ?? { $exists: true }
                }
            },
            {
                $group: {
                    _id: {
                        $dateTrunc: {
                            date: "$date",
                            unit: "day"
                        }
                    },
                    count: {
                        [this.data_type === 'bouncing' ? '$avg' : '$sum']: "$data"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: 1
                }
            },
            {
                $densify: {
                    field: "date",
                    range: {
                        step: 1,
                        unit: "day",
                        bounds: [from, to]
                    }
                }
            },
            {
                $project: {
                    _id: "$date",
                    count: {
                        $ifNull: ["$count", 0]
                    }
                }
            }
        ];

        const data = await AggModel.aggregate(aggregation);
        return data;

    }

    async executeDynamic(options: BaseOptions) {
        const start = performance.now();
        if (options.slice === 'day') {
            const aggregated = await this.getAggregated(options);
            if (aggregated.findIndex(e => e.count != 0) != -1) {
                const end = performance.now();
                return { time: end - start, data: aggregated }
            }
        }
        const data = await this.getTimeline(options);
        const end = performance.now();
        return { time: end - start, data }
    }

    async aggregate(options: AggregateOptions) {
        const { project_id } = options;

        const date = startOfDay(new UTCDate(options.date))

        for (const domain of options.domains) {

            if (options.override === false) {
                const exists = await AggModel.exists({ project_id, date, domain, data_type: this.data_type });
                if (exists) continue;
            }

            const data = await this.getTimeline({ project_id, from: startOfDay(date).getTime(), to: endOfDay(date).getTime(), slice: 'day', domain, ignoreSliceSize: true });
            if (data.length == 0) continue;

            await AggModel.updateOne({ project_id, date, domain, data_type: this.data_type }, {
                data: this.parse(data[0])
            }, { upsert: true });

        }
    }

}
