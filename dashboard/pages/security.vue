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

const { createAlert } = useAlert();

function showAnomalyInfoAlert() {
    createAlert('AI Anomaly Detector info',
        `Anomaly detector is running. It helps you detect a spike in visits or events, it could mean an
         attack or simply higher traffic due to good performance. Additionally, it can detect if someone is
         stealing parts of your website and hosting a duplicate version—an unfortunately common practice.
         Litlyx will notify you via email with actionable advices`,
        'far fa-shield',
        10000
    )
}

</script>


<template>

    <div class="home w-full h-full px-10 pt-6 overflow-y-auto">

        <div class="flex gap-2 items-center text-text/90 justify-end">
            <div class="animate-pulse w-[1rem] h-[1rem] bg-green-400 rounded-full"> </div>
            <div class="poppins font-regular text-[1rem]"> AI Anomaly Detector </div>
            <div class="flex items-center">
                <i class="far fa-info-circle text-[.9rem] hover:text-lyx-primary cursor-pointer"
                    @click="showAnomalyInfoAlert"></i>
            </div>
        </div>



        <div class="w-full h-full py-8 px-12">
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

    </div>

</template>
