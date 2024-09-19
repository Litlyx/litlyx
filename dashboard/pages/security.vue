<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });
const activeProjectId = useActiveProjectId();

const headers = computed(() => {
    return {
        'Authorization': authorizationHeaderComputed.value,
        'x-pid': activeProjectId.data.value || ''
    }
});

const reportList = useFetch(`/api/security/list`, { headers });

</script>


<template>

    <div class="home w-full h-full px-10 lg:px-0 pt-6 overflow-y-auto">

        <div v-if="reportList.data.value" class="flex flex-col gap-2">
            <div v-for="entry of reportList.data.value">
                <div v-if="entry.type === 'event'" class="flex gap-2">
                    <div class="text-lyx-text-darker">{{ new Date(entry.data.created_at).toLocaleString() }}</div>
                    <UBadge class="w-[4rem] flex justify-center"> {{ entry.type }} </UBadge>
                    <div class="text-lyx-text-dark">
                        Event date: {{ new Date(entry.data.eventDate).toLocaleString() }}
                    </div>
                </div>
                <div v-if="entry.type === 'visit'" class="flex gap-2">
                    <div class="text-lyx-text-darker">{{ new Date(entry.data.created_at).toLocaleString() }}</div>
                    <UBadge class="w-[4rem] flex justify-center"> {{ entry.type }} </UBadge>
                    <div class="text-lyx-text-dark">
                        Visit date: {{ new Date(entry.data.visitDate).toLocaleString() }}
                    </div>
                </div>
                <div v-if="entry.type === 'domain'" class="flex gap-2">
                    <div class="text-lyx-text-darker">{{ new Date(entry.data.created_at).toLocaleString() }}</div>
                    <UBadge class="w-[4rem] flex justify-center"> {{ entry.type }} </UBadge>
                    <div class="text-lyx-text-dark">
                        Domain found: {{ entry.data.domain }}
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>
