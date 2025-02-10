<script lang="ts" setup>
import DeleteDomainData from '../dialog/DeleteDomainData.vue';
import type { SettingsTemplateEntry } from './Template.vue';


const { isGuest } = useProject();

const entries: SettingsTemplateEntry[] = [
    { id: 'delete_dns', title: 'Delete domain data', text: 'Delete data of a specific domain from this project' },
    { id: 'delete_data', title: 'Delete project data', text: 'Delete all data from this project' },
]

const domains = useFetch('/api/settings/domains', {
    headers: useComputedHeaders({ useSnapshotDates: false }),
    transform: (e) => {
        if (!e) return [];
        return e.sort((a, b) => {
            return a.count - b.count;
        }).map(e => {
            return { id: e._id, label: `${e._id} - ${e.count} visits` }
        })
    }
})

const selectedDomain = ref<{ id: string, label: string }>();
const selectedVisits = ref<boolean>(true);
const selectedSessions = ref<boolean>(true);
const selectedEvents = ref<boolean>(true);


const domainCounts = useFetch(() => `/api/settings/domain_counts?domain=${selectedDomain.value?.id}`, {
    headers: useComputedHeaders({ useSnapshotDates: false }),
})


const { setToken } = useAccessToken();


const modal = useModal();

function openDeleteDomainDataDialog() {
    modal.open(DeleteDomainData, {
        preventClose: true,
        deleteData: {
            isAll: false,
            domain: selectedDomain.value?.id as string,
            visits: selectedVisits.value,
            sessions: selectedSessions.value,
            events: selectedEvents.value,
        },
        buttonType: 'primary',
        message: 'This action is irreversable and will wipe all the data from the selected domain.',
        onSuccess: () => {
            modal.close()
        },
        onCancel: () => {
            modal.close()
        },
    });
}

function openDeleteAllDomainDataDialog() {
    modal.open(DeleteDomainData, {
        preventClose: true,
        deleteData: {
            isAll: true,
            domain: '',
            visits: false,
            sessions: false,
            events: false,
        },
        buttonType: 'danger',
        message: 'This action is irreversable and will wipe all the data from the entire project.',
        onSuccess: () => {
            modal.close()
        },
        onCancel: () => {
            modal.close()
        },
    });
}


const visitsLabel = computed(() => {
    if (domainCounts.pending.value === true) return 'Visits loading...';
    if (domainCounts.data.value?.error === true) return 'Visits (too many to compute)';
    return 'Visits ' + (domainCounts.data.value?.visits ?? '');
})

const eventsLabel = computed(() => {
    if (domainCounts.pending.value === true) return 'Events loading...';
    if (domainCounts.data.value?.error === true) return 'Events (too many to compute)';
    return 'Events ' + (domainCounts.data.value?.events ?? '');
})

const sessionsLabel = computed(() => {
    if (domainCounts.pending.value === true) return 'Sessions loading...';
    if (domainCounts.data.value?.error === true) return 'Sessions (too many to compute)';
    return 'Sessions ' + (domainCounts.data.value?.sessions ?? '');
})

</script>


<template>
    <SettingsTemplate :entries="entries">
        <template #delete_dns>
            <div class="flex flex-col">

                <!-- <div class="text-[.9rem] text-lyx-text-darker"> Select a domain </div> -->
                <USelectMenu v-if="!isGuest" placeholder="Select a domain" :uiMenu="{
                    select: 'bg-lyx-lightmode-widget-light !ring-lyx-lightmode-widget dark:!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter dark:!ring-lyx-widget-lighter',
                    base: '!bg-lyx-lightmode-widget dark:!bg-lyx-widget',
                    option: {
                        base: 'hover:!bg-lyx-lightmode-widget-light dark:hover:!bg-lyx-widget-lighter cursor-pointer',
                        active: '!bg-lyx-lightmode-widget-light dark:!bg-lyx-widget-lighter'
                    }
                }" :options="domains.data.value ?? []" v-model="selectedDomain"></USelectMenu>

                <div v-if="isGuest" class="text-lyx-text-darker"> Guests cannot delete data</div>

                <div v-if="selectedDomain" class="flex flex-col gap-2 mt-4">
                    <div class="text-[.9rem] text-lyx-text-dark"> Select data to delete </div>

                    <div class="flex flex-col gap-1">


                        <UCheckbox :ui="{ color: 'actionable-visits-color-checkbox' }" v-model="selectedVisits"
                            :label="visitsLabel" />
                        <UCheckbox :ui="{ color: 'actionable-sessions-color-checkbox' }" v-model="selectedSessions"
                            :label="sessionsLabel" />
                        <UCheckbox :ui="{ color: 'actionable-events-color-checkbox' }" v-model="selectedEvents"
                            :label="eventsLabel" />

                    </div>

                    <LyxUiButton class="mt-2" v-if="selectedVisits || selectedSessions || selectedEvents"
                        @click="openDeleteDomainDataDialog()" type="outline">
                        Delete data
                    </LyxUiButton>
                    <div class="text-lyx-text-dark">
                        This action will delete all data from the project creation date.
                    </div>
                </div>
            </div>
        </template>
        <template #delete_data>

            <div v-if="!isGuest"
                class="outline rounded-lg w-full px-8 py-4 flex flex-col gap-4 outline-[1px] outline-[#541c15] bg-lyx-lightmode-widget-light dark:bg-[#1e1412]">
                <div class="poppins font-semibold"> This operation will reset this project to it's initial state (0
                    visits 0 events 0 sessions) </div>
                <div @click="openDeleteAllDomainDataDialog()"
                    class="text-[#e95b61] poppins font-semibold cursor-pointer hover:text-black hover:bg-red-700 outline rounded-lg w-fit px-8 py-2 outline-[1px] outline-[#532b26] bg-lyx-lightmode-widget-light dark:bg-[#291415]">
                    Delete all data
                </div>
            </div>

            <div v-if="isGuest" class="text-lyx-text-darker"> Guests cannot delete data</div>
        </template>
    </SettingsTemplate>
</template>
