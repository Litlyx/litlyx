<script setup lang="ts">

import SupabaseChartDialog from '~/components/integrations/SupabaseChartDialog.vue';

definePageMeta({ layout: 'dashboard' });
const activeProjectId = useActiveProjectId();


const { createAlert } = useAlert();

const {
    supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey, integrationsCredentials,
    supabaseIntegrations, updateIntegrationsCredentails
} = useSupabase()

async function updateCredentials() {

    const res = await updateIntegrationsCredentails({
        supabase_url: supabaseUrl.value,
        supabase_anon_key: supabaseAnonKey.value,
        supabase_service_role_key: supabaseServiceRoleKey.value
    });

    if (res.ok === true) {
        integrationsCredentials.refresh();
        createAlert('Credentials updated', 'Credentials updated successfully', 'far fa-error', 4000);
    } else {
        createAlert('Error updating credentials', res.error, 'far fa-error', 4000);
    }

}

const { openDialogEx } = useCustomDialog()

function showChartDialog() {
    openDialogEx(SupabaseChartDialog, {
        closable: true,
        width: '55vw',
        height: '65vh'
    })
}

</script>


<template>

    <div class="home w-full h-full px-10 pt-6 overflow-y-auto">

        <CardTitled title="Supabase integration" class="w-full">
            <template #header>
                <img class="h-10 w-10" :src="'supabase.svg'" alt="Supabase logo">
            </template>
            <div class="flex gap-6 flex-col w-full">
                <div class="flex flex-col">
                    <div class="text-lyx-text"> Supabase url </div>
                    <div class="text-lyx-text-dark"> Required to fetch data from supabase </div>
                    <LyxUiInput v-if="!integrationsCredentials.pending.value" class="w-full mt-2 px-4 py-1"
                        v-model="supabaseUrl" type="text"></LyxUiInput>
                    <div v-if="integrationsCredentials.pending.value"> Loading... </div>
                </div>
                <div class="flex flex-col">
                    <div class="text-lyx-text"> Supabase anon key </div>
                    <div class="text-lyx-text-dark"> Required to fetch data from supabase </div>
                    <LyxUiInput v-if="!integrationsCredentials.pending.value" class="w-full mt-2 px-4 py-1"
                        v-model="supabaseAnonKey" type="password"></LyxUiInput>
                    <div v-if="integrationsCredentials.pending.value"> Loading... </div>
                </div>
                <div class="flex flex-col">
                    <div class="text-lyx-text"> Supabase service role key </div>
                    <div class="text-lyx-text-dark"> Only used if you need to bypass RLS </div>
                    <LyxUiInput v-if="!integrationsCredentials.pending.value" class="w-full mt-2 px-4 py-1"
                        v-model="supabaseServiceRoleKey" type="password"></LyxUiInput>
                    <div v-if="integrationsCredentials.pending.value"> Loading... </div>
                </div>
                <div class="flex gap-3">
                    <LyxUiButton v-if="!integrationsCredentials.pending.value" @click="updateCredentials()"
                        type="primary"> Save
                    </LyxUiButton>
                </div>
            </div>
        </CardTitled>


        <LyxUiCard class="mt-6 w-full">
            <div class="flex flex-col gap-8">
                <div class="flex gap-2 items-center" v-for="supabaseIntegration of supabaseIntegrations.data.value">
                    <div> {{ supabaseIntegration.name }} </div>
                    <div> <i class="far fa-edit"></i> </div>
                    <div> <i class="far fa-trash"></i> </div>
                </div>
                <div>
                    <LyxUiButton type="primary" @click="showChartDialog()"> Add supabase chart </LyxUiButton>
                </div>
            </div>
        </LyxUiCard>


        <div class="mt-10">
            <IntegrationsSupabaseLineChart integration_id="66f6c558d97e4abd408feee0"></IntegrationsSupabaseLineChart>
        </div>

    </div>

</template>
