<script setup lang="ts">

import Browsers from './line-data/Browsers.vue';

import Cities from './line-data/Cities.vue';
import Regions from './line-data/Regions.vue';
import Countries from './line-data/Countries.vue';
import Continents from './line-data/Continents.vue';

import Devices from './line-data/Devices.vue';
import Events from './line-data/Events.vue';
import Oss from './line-data/Oss.vue';

import Pages from './line-data/Pages.vue';
import EntryPages from './line-data/EntryPages.vue';
import ExitPages from './line-data/ExitPages.vue';

import Referrers from './line-data/Referrers.vue';


import Utm_generic from './line-data/UtmGeneric.vue';

import SelectCountry from './line-data/selectors/SelectCountry.vue';
import SelectDevice from './line-data/selectors/SelectDevice.vue';
import SelectPage from './line-data/selectors/SelectPage.vue';
import SelectRefer from './line-data/selectors/SelectRefer.vue';

import ShowMoreDialog, { type ShowMoreDialogProps } from './line-data/ShowMoreDialog.vue';
import type { LineDataProps } from './line-data/LineDataTemplate.vue';
import { RefreshCwIcon } from 'lucide-vue-next';

type LineDataType = 'referrers' | 'utm_generic' | 'pages' | 'pages_entries' | 'pages_exits' | 'countries' | 'cities' | 'continents' | 'regions' | 'devices' | 'browsers' | 'oss' | 'events';
type LineDataTypeSelectable = 'referrers' | 'devices' | 'countries' | 'pages';

const props = defineProps<{
    type: LineDataType,
    select?: boolean,
    sharedLink?: string
}>();

const selected = ref<string>(props.type)

const selectMap: Record<LineDataTypeSelectable, Component> = {
    referrers: SelectRefer,
    devices: SelectDevice,
    countries: SelectCountry,
    pages: SelectPage,
}

const selectedComponent = computed(() => {
    if (!selected.value) return;
    if (!selected.value.startsWith('utm_')) return componentsMap[selected.value as LineDataTypeSelectable];
    return componentsMap.utm_generic;
});

const componentsMap: Record<LineDataType, Component> = {
    referrers: Referrers,
    utm_generic: Utm_generic,
    pages: Pages,
    pages_entries: EntryPages,
    pages_exits: ExitPages,
    continents: Continents,
    countries: Countries,
    regions: Regions,
    cities: Cities,
    devices: Devices,
    browsers: Browsers,
    oss: Oss,
    events: Events,
}

const currentData = ref<LineDataProps>();

function onChildInit(data: LineDataProps) {
    currentData.value = data;
}

const refreshToken = ref(0);

async function refreshData() {
    refreshToken.value++;
}

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle v-if="currentData" class="flex gap-2">
                <div class="capitalize"> {{ currentData.title }} </div>
                <RefreshCwIcon @click="refreshData" class="size-4 hover:rotate-90 cursor-pointer transition-all">
                </RefreshCwIcon>
            </CardTitle>
            <CardDescription v-if="currentData"> {{ currentData.sub }} </CardDescription>
            <CardAction class="flex gap-2">
                <component v-if="props.select" :is="selectMap[(props.type as LineDataTypeSelectable)] ?? undefined"
                    v-model="selected" />
            </CardAction>
        </CardHeader>
        <CardContent v-if="selectedComponent">
            <component :shared-link="sharedLink" :refresh-token="refreshToken" @init="onChildInit" class="h-full" :is="selectedComponent"
                :advanced_data="{ raw_selected: selected }"></component>
            <!-- componente con all'interno il @click="emits('showMore')" -->
        </CardContent>
    </Card>
</template>