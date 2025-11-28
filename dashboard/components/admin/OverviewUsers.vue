<script lang="ts" setup>
import type { DateRange } from 'reka-ui'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { CalendarIcon, LucideSearch, X } from 'lucide-vue-next'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const currentPage = ref<number>(1);

const currentSorting = ref<string>('usage-more')

const popoverOpen = ref<boolean>(false);

const search = ref<string>('');
const searchRequest = ref<string>('');

function clearSearchData() {
    searchRequest.value = '';
    search.value = '';
}

function searchData() {
    searchRequest.value = search.value;
}

const value = ref<DateRange>({
    start: new CalendarDate(new Date().getFullYear(), new Date().getUTCMonth() + 1, 1),
    end: new CalendarDate(new Date().getFullYear(), new Date().getUTCMonth() + 1, new Date().getDate())
}) as Ref<DateRange>;

const df = new DateFormatter('en-US', { dateStyle: 'medium' })

const { data: info } = useAuthFetch(() => `/api/admin/users?page=${currentPage.value}&sort=${currentSorting.value}&from=${value.value.start}&to=${value.value.end}&search=${searchRequest.value}`);

function onPageChange(page: number) {
    currentPage.value = page;
}

function isActive(u: any) {
    const updates: Date[] = u.projects.map((e: any) => new Date(e.counts[0].updated_at));
    const lastUpdates = updates.toSorted((a, b) => b.getTime() - a.getTime());
    if (lastUpdates.length == 0) return false;
    const lastUpdate = lastUpdates[0];
    if (lastUpdate.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 3) return false;
    return true;
}

function setDate(hours: number) {
    const start = new Date(Date.now() - hours * 1000 * 60 * 60);
    value.value.start = new CalendarDate(start.getFullYear(), start.getUTCMonth() + 1, start.getDate());
    value.value.end = new CalendarDate(new Date().getFullYear(), new Date().getUTCMonth() + 1, new Date().getDate());
}

// function getLastUpdate(u: any) {
//     const updates: Date[] = u.projects.map((e: any) => new Date(e.counts[0].updated_at));
//     const lastUpdates = updates.toSorted((a, b) => b.getTime() - a.getTime());
//     if (lastUpdates.length == 0) return '-';
//     const lastUpdate = lastUpdates[0];
//     return lastUpdate.toLocaleDateString('it-IT');
// }

</script>

<template>
    <div class="flex flex-col gap-6 h-full overflow-hidden">
        <div class="flex justify-center gap-8">

            <Select v-model="currentSorting">
                <SelectTrigger>
                    <SelectValue class="w-[8rem]">
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="newer">
                            Newer
                        </SelectItem>
                        <SelectItem value="older">
                            Older
                        </SelectItem>
                        <SelectItem value="usage-more">
                            More usage %
                        </SelectItem>
                        <SelectItem value="usage-less">
                            Less usage %
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Popover v-model:open="popoverOpen">
                <PopoverTrigger as-child>
                    <Button variant="outline">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        <template v-if="value.start">
                            <template v-if="value.end">
                                {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{
                                    df.format(value.end.toDate(getLocalTimeZone())) }}
                            </template>

                            <template v-else>
                                {{ df.format(value.start.toDate(getLocalTimeZone())) }}
                            </template>
                        </template>
                        <template v-else>
                            Pick a date
                        </template>
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-4 flex flex-col items-end relative z-[90]">
                    <RangeCalendar v-model="value" initial-focus :number-of-months="2"
                        @update:start-value="(startDate) => value.start = startDate" />
                    <Button @click="popoverOpen = false;"> Confirm </Button>
                </PopoverContent>
            </Popover>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button size="sm"> Timeframe </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem @click="setDate(365 * 10 * 24)">
                            All Time
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="setDate(48)">
                            Last day
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="setDate(30 * 24)">
                            Last 30 days
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="setDate(60 * 24)">
                            Last 60 days
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="setDate(90 * 24)">
                            Last 90 days
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <div class="flex items-center gap-2">
                <Input class="w-[20rem]" v-model="search" />
                <Button :disabled="search == searchRequest" @click="searchData()" size="icon">
                    <LucideSearch></LucideSearch>
                </Button>
                <Button v-if="searchRequest.length > 0" @click="clearSearchData()" size="icon">
                    <X></X>
                </Button>
            </div>

        </div>

        <Pagination v-if="info" @update:page="onPageChange" v-slot="{ page }" :items-per-page="20" :total="info.count"
            :default-page="currentPage">
            <PaginationContent v-slot="{ items }">
                <PaginationPrevious />
                <template v-for="(item, index) in items" :key="index">
                    <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === page">
                        {{ item.value }}
                    </PaginationItem>
                </template>
                <PaginationEllipsis v-if="info.count > 20 * 4" :index="4" />
                <PaginationNext />
            </PaginationContent>
        </Pagination>
        <div class="overflow-y-auto pb-10">
            <div class="grid grid-cols-2 gap-4" v-if="info">
                <Card v-for="user of info.users">
                    <CardContent>
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-2">
                                <div class="size-3 rounded-full mt-[1px] bg-red-200" :class="{
                                    '!bg-green-200': isActive(user)
                                }"></div>
                                <!-- <Label> {{ getLastUpdate(user) }} </Label> -->
                                <Label> {{ user.email }} </Label>
                                <Label class="text-muted-foreground">
                                    {{ new Date(user.created_at).toLocaleDateString('it-IT') }}
                                </Label>
                                <Label class="text-muted-foreground ml-2">
                                    {{ user.visits + user.events }} / {{ user.limit }}
                                    ({{ Math.floor(100 / user.limit * (user.visits + user.events)) }}%)
                                </Label>
                            </div>
                            <div>
                                <Progress
                                    :model-value="Math.min(Math.floor(100 / user.limit * (user.visits + user.events)), 100)"></Progress>
                            </div>
                            <div class="flex gap-8 flex-wrap">
                                <div v-for="p of user.projects">
                                    <AdminOverviewPopoverProject :project="p">
                                    </AdminOverviewPopoverProject>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>