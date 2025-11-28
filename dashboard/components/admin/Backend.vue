<script lang="ts" setup>

const { data: result, refresh, status } = useAuthFetch<{
    aggregations: { info: any, advanced: any, chunks: any[] }[],
    operations: any[]
}>('/api/admin/shard/info');

function getLastModified(e: any) {
    return new Date(new Date(e.info.lastmod).getTime() + 1000 * 60 * 60).toLocaleString('it-IT')
}

function getKeys(e: any) {
    return Object.keys(e.info.key);
}

const replSets = ['shard1ReplSet', 'shard2ReplSet', 'shard3ReplSet'];
const colors = ['#d0f4de', '#ffadad', '#e4c1f9', '#fcf6bd', '#ff99c8'];
const chunkColors = ['#808080', '#dddddd', '#ccaa00'];

// const collections = computed(() => {

//     if (!result.value) return;

//     const returnData: {
//         shards: { data: any, stats: any, doc_percent: number, color: string }[],
//         info: any,
//         advanced: any
//     }[] = [];

//     for (const collection of result.value.aggregations) {
//         const info = collection.info;
//         const advanced = collection.advanced;

//         const totalDocs = replSets.reduce((a, repl) => {
//             return a + ((collection.stats.find((e: any) => e.shard === repl)?.count ?? 0));
//         }, 0);

//         const shards = replSets.map((repl, index) => {
//             const data = collection.data.find((e: any) => e.shard === repl);
//             const stats = collection.stats.find((e: any) => e.shard === repl);
//             const color = colors[index];
//             if (!data || !stats) return {
//                 data: {
//                     chunkCount: 0,
//                     percent: 0
//                 },
//                 stats: {
//                     count: 0
//                 },
//                 doc_percent: 0,
//                 color
//             };
//             const percent = 100 / totalDocs * (stats.count);
//             return { data, stats, doc_percent: percent, color };
//         });
//         returnData.push({ shards, info, advanced });
//     }


//     return returnData;
// });


function getShardsOrdered(coll: any) {
    const shards: Record<string, any> = {}
    for (const replSet of replSets) {
        shards[replSet] = coll.advanced.shards[replSet] ?? { count: 0, totalSize: 0, totalIndexSize: 0 }
        shards[replSet] = { ...shards[replSet], chunks: coll.chunks.find((e: any) => e.shard === replSet)?.chunkCount ?? 0 }
    }
    return shards;
}

</script>

<template>
    <div class="flex flex-col gap-4 h-full overflow-y-auto">

        <div v-if="result && result.operations.length > 0" class="flex flex-col gap-2 mt-4">
            <AdminBackendOperation :operation="op" v-for="op of result.operations"> </AdminBackendOperation>
        </div>

        <div v-if="result">
            <div class="flex items-center gap-2">
                <Button @click="refresh()" size="sm"> Refresh </Button>
                <Label> Status: {{ status }} </Label>
            </div>
            <div class="flex flex-col gap-2 mt-4">
                <Card v-for="coll of result.aggregations" class="gap-2">
                    <CardContent class="flex flex-col gap-8">
                        <div class="flex gap-2 items-center">

                            <div :class="{
                                'bg-green-200': !coll.info.noBalance,
                                'bg-red-200': coll.info.noBalance,
                            }" class="rounded-full size-3"></div>

                            <div class="w-[15rem]">
                                <div> {{ coll.info._id.split('.')[1].toString() }} </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <div v-for="k of getKeys(coll)" class="flex items-center">
                                    <Icon name="material-symbols:key-vertical" :size="16"></Icon>
                                    <div> {{ k }} </div>
                                </div>
                            </div>


                        </div>

                        <div class="grid grid-cols-[auto_auto_auto]">
                            <div v-for="(value, indexName) in coll.advanced.indexSizes" class="flex items-center gap-2">
                                <div class="w-[5.5rem] text-right"> {{ formatBytes(value, 2) }} </div>
                                <Icon name="material-symbols:key-vertical" :size="16"></Icon>
                                <div> {{ indexName }} </div>
                            </div>
                        </div>

                        <Separator></Separator>


                        <div class="flex flex-col gap-2">

                            <AdminBackendShardData v-for="(shard, shardName) of getShardsOrdered(coll)"
                                :shardName="(shardName as any)" :count="shard.count" :totalSize="shard.totalSize"
                                :totalIndexSize="shard.totalIndexSize" :chunks="shard.chunks">
                            </AdminBackendShardData>

                            <AdminBackendShardData shardName="Total" :count="coll.advanced.count"
                                :totalSize="coll.advanced.totalSize" :totalIndexSize="coll.advanced.totalIndexSize">
                            </AdminBackendShardData>


                        </div>

                    </CardContent>
                </Card>
            </div>

        </div>

    </div>
</template>