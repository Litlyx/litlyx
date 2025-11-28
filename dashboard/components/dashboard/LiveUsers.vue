<script lang="ts" setup>
import type { Slice } from '~/shared/services/DateService';
import type { TopCardData } from './TopCard.vue';
import dateServiceInstance from '~/shared/services/DateService';


const snapshotStore = useSnapshotStore();

const chartSlice = computed<Slice>(() => {
    if (snapshotStore.duration <= 3) return 'hour';
    if (snapshotStore.duration <= 31 * 3) return 'day';
    return 'month';
});

const { data: live_users, status: live_users_status, refresh: live_users_refresh } = useAuthFetch('/api/project/live_users');
// const { data: live_users_data, status: live_users_data_status } = useAuthFetch('/api/timeline/live_users', {
//     headers: { 'x-slice': chartSlice },
//     lazy: true
// });

let interval: any;

onMounted(() => {
    interval = setInterval(() => {
        live_users_refresh();
    }, 30_000)
});

onUnmounted(() => {
    if (interval) clearInterval(interval);
})


// const liveData = computed<Pick<TopCardData, 'todayIndex' | 'chart_data' | 'chart_labels' | 'color'>>(() => {

//     // const count = live_users_data.value?.reduce((a, e) => a + e.count, 0) ?? 0;
//     // const size = live_users_data.value?.length ?? 1;

//     const result: Pick<TopCardData, 'todayIndex' | 'chart_data' | 'chart_labels' | 'color'> = {
//         color: '#FF0000',
//         todayIndex: -1,
//         chart_data: live_users_data.value?.map(e => e.count) ?? [],
//         chart_labels: live_users_data.value?.map(e => dateServiceInstance.getChartLabelFromISO(e.timestamp, chartSlice.value)) ?? []
//     }
//     return result;
// });

</script>

<template>
<!--     <Card class="w-fit py-4 rounded-md">
        <CardContent class="flex gap-4 items-center">
            <div class="flex items-center gap-1 poppins">
                <div class="size-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                <div v-if="live_users != undefined && live_users_status === 'success'">{{ live_users }}</div>
                <Loader v-else class="!size-4"></Loader>
                <div> live users </div>
            </div>
             <div class="grow">
                <div v-if="live_users_data != undefined && live_users_data_status === 'success'">
                    <DashboardTopChart class="w-full !h-[2rem]" :todayIndex="liveData.todayIndex" :data="liveData.chart_data"
                        :labels="liveData.chart_labels" :color="liveData.color">
                    </DashboardTopChart>
                </div>
                <Loader v-else class="!size-4"></Loader>
            </div> 
        </CardContent>
    </Card> -->

            <div class="flex items-center gap-1 poppins bg-border/20 py-1 px-2 rounded-md">
                <div class="size-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                <div v-if="live_users != undefined && live_users_status === 'success'">{{ live_users }}</div>
                <Loader v-else class="!size-4"></Loader>
                <div> live  </div>
            </div>
</template>