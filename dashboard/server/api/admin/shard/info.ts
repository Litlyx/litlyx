

import mongoose from "mongoose";


async function executeAggregation(uuid: string) {
    const aggregation = [
        { $match: { uuid: new mongoose.Types.UUID(uuid) } },
        { $group: { _id: "$shard", chunkCount: { $sum: 1 } } },
        {
            $group: {
                _id: null,
                total: { $sum: "$chunkCount" },
                shards: { $push: { shard: "$_id", count: "$chunkCount" } }
            }
        },
        { $unwind: "$shards" },
        {
            $project: {
                _id: 0,
                shard: "$shards.shard",
                chunkCount: "$shards.count",
                percent: { $round: [{ $multiply: [{ $divide: ["$shards.count", "$total"] }, 100] }, 2] }
            }
        }
    ]

    const result = await mongoose.connection.useDb('config').collection('chunks').aggregate(aggregation).toArray();

    return result;

}

async function getAllCollections() {
    const result = await mongoose.connection.useDb('config').collection('collections').find({}).toArray();
    return result.filter((e: any) => e._id.startsWith('SimpleMetrics'));
}

async function getOperations() {
    try {

        const db = mongoose.connection.db?.admin();
        if (!db) return [];
        const result = await db.command({
            aggregate: 1,
            pipeline: [
                { $currentOp: { allUsers: true, localOps: false } },
                { $match: { type: 'op', "originatingCommand.reshardCollection": { $regex: "^SimpleMetrics.*" } } }
            ],
            cursor: {}
        });

        return result.cursor.firstBatch
    } catch (ex) {
        console.error('Error fetching current ops:', ex);
        return [];
    }
}

async function getAdvancedInfo(collection: string) {
    try {
        const db = mongoose.connection.useDb('SimpleMetrics');
        const nativeDb = db.db;
        const stats = await nativeDb?.command({ collStats: collection });
        return stats;
    } catch (ex) {
        console.error("Error getting index info:", ex);
        return [];
    }
}

export default defineEventHandler(async event => {
    const ctx = await getRequestContext(event, 'admin');

    const collections = await getAllCollections();

    const aggregations = await Promise.all(collections.map(async e => {
        const collName = e._id.toString().split('.')[1];
        const chunks = await executeAggregation(e.uuid.toString());
        const advanced = await getAdvancedInfo(collName);
        return { info: e, advanced, chunks }
    }))

    const operations = await getOperations();

    return { aggregations, operations };


});