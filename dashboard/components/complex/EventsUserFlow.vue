<script lang="ts" setup>

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-vue-next';

const { data: events, status: eventsStatus } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/events', {
    headers: { 'x-limit': '1000' }, lazy: true, key: 'list:events'
});

const result = ref<any>();
const analyzing = ref<boolean>(false);
const selectedEvent = ref<string>();

watch(selectedEvent, () => {
    if (!selectedEvent.value) return;
    analyzeEvents();
})

async function analyzeEvents() {
    if (!selectedEvent.value) return;
    analyzing.value = true;
    const res = await useAuthFetchSync<{ _id: string, count: number }[]>(`/api/data/event_user_flow?event_name=${selectedEvent.value}`);
    const count = res.reduce((a, e) => a + e.count, 0);
    result.value = res.map(e => ({ ...e, count: 100 / count * e.count })).toSorted((a, b) => b.count - a.count);
    analyzing.value = false;
}

</script>

<template>
    <Card class="w-full">
        <CardHeader>
            <CardTitle> Events User Flow </CardTitle>
            <CardDescription>
                Track your user's journey from external links to in-app events, maintaining a complete view of their
                path from entry to engagement.
            </CardDescription>
            <CardContent class="p-0 mt-6">

                <div v-if="eventsStatus !== 'success'" class="flex items-center justify-center h-[10rem]">
                    <LoaderCircle class="size-10 animate-[spin_1s_ease-in-out_infinite] duration-500">
                    </LoaderCircle>
                </div>

                <Select v-if="eventsStatus === 'success'" v-model="selectedEvent">
                    <SelectTrigger>
                        <SelectValue class="w-[15rem]" placeholder="Select an event">
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem v-for="event of events" :value="event._id">
                                {{ event._id }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div class="mt-8">
                    <div v-if="!analyzing && result" class="flex flex-col gap-2">

                        <div class="relative h-8 px-4 flex items-center bg-[#1b1b1d] rounded-lg text-[.9rem] poppins"
                            v-for="item of result">
                            <div class="z-[5]"> {{ item._id }} </div>
                            <div class="grow"></div>
                            <div class="z-[5]">{{ item.count.toFixed(2) }} %</div>
                            
                            <div :style="`width: ${Math.floor(item.count)}%`" class="absolute bg-[#7537F340] rounded-lg top-0 left-0 h-full">
                            </div>
                        </div>

                    </div>
                    <div v-if="analyzing" class="flex flex-col gap-2">
                        <Skeleton class="h-8 w-full"></Skeleton>
                        <Skeleton class="h-8 w-full"></Skeleton>
                        <Skeleton class="h-8 w-full"></Skeleton>
                    </div>
                </div>


            </CardContent>
        </CardHeader>
    </Card>
</template>