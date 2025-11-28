<script lang="ts" setup>

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-vue-next';

const result = ref<any>();
const analyzing = ref<boolean>(false);

const selectedEvent = ref<string>();
const selectedEventField = ref<string>();

const total = ref<number>(0);

const { data: events, status: eventsStatus } = useAuthFetch<{ _id: string, count: number }[]>('/api/data/events', {
    headers: { 'x-limit': '1000' }, lazy: true, key: 'list:events'
});

const { data: eventFields, status: eventFieldsStatus } = useAuthFetch<string[]>(() => `/api/data/event_metadata_fields?event_name=${selectedEvent?.value ?? 'null'}`, {
    lazy: true, immediate: false
});

watch(selectedEventField, () => {
    if (!selectedEventField.value) return;
    analyzeMetadata();
})


async function analyzeMetadata() {
    if (!selectedEvent.value) return;
    if (!selectedEventField.value) return;
    analyzing.value = true;
    const res = await useAuthFetchSync<{ _id: string, count: number }[]>(`/api/data/event_metadata_analyze?event_name=${selectedEvent.value}&field_name=${selectedEventField.value}`);
    // const count = res.reduce((a, e) => a + e.count, 0);
    // result.value = res.map(e => ({ ...e, count: 100 / count * e.count })).toSorted((a, b) => b.count - a.count);
    total.value = res.reduce((a, e) => a + e.count, 0);
    result.value = res;
    analyzing.value = false;
}

</script>

<template>
    <Card class="w-full">
        <CardHeader>
            <CardTitle> Analyze event metadata </CardTitle>
            <CardDescription>
                Filter events metadata fields to analyze them
            </CardDescription>
            <CardContent class="p-0 mt-6">

                <div v-if="eventsStatus !== 'success'" class="flex items-center justify-center h-[10rem]">
                    <LoaderCircle class="size-10 animate-[spin_1s_ease-in-out_infinite] duration-500">
                    </LoaderCircle>
                </div>

                <div class="flex flex-col gap-2">

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

                    <Select v-if="eventFieldsStatus === 'success'" v-model="selectedEventField">
                        <SelectTrigger>
                            <SelectValue class="w-[15rem]" placeholder="Select an event">
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem v-for="field of eventFields" :value="field">
                                    {{ field }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div class="mt-8">
                    <div v-if="!analyzing && result" class="flex flex-col gap-2">

                        <div class="relative h-8 px-4 flex items-center bg-[#1b1b1d] rounded-lg text-[.9rem] poppins"
                            v-for="item of result">
                            <div class="z-[5]"> {{ item._id }} </div>
                            <div class="grow"></div>
                            <div class="z-[5]">{{ item.count }}</div>
                            <div :style="`width: ${Math.floor(100 / total  * item.count)}%`"
                                class="absolute bg-[#7537F340] rounded-lg top-0 left-0 h-full">
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