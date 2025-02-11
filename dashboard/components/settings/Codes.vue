<script lang="ts" setup>
import type { TApiSettings } from '@schema/ApiSettingsSchema';
import type { SettingsTemplateEntry } from './Template.vue';

const { project, isGuest } = useProject();

const entries: SettingsTemplateEntry[] = [
    { id: 'acodes', title: 'Appsumo codes', text: 'Redeem appsumo codes' },
]

const { createAlert } = useAlert()

const currentCode = ref<string>("");
const redeeming = ref<boolean>(false);

const valid_codes = useFetch('/api/pay/valid_codes', signHeaders({ 'x-pid': project.value?._id.toString() ?? '' }));

async function redeemCode() {
    redeeming.value = true;
    try {
        const res = await $fetch<TApiSettings>('/api/pay/redeem_appsumo_code', {
            method: 'POST', ...signHeaders({
                'Content-Type': 'application/json',
                'x-pid': project.value?._id.toString() ?? ''
            }),
            body: JSON.stringify({ code: currentCode.value })
        });
        createAlert('Success', 'Code redeem success.', 'far fa-check', 5000);
        valid_codes.refresh();
    } catch (ex: any) {
        createAlert('Error', ex?.response?.statusText || 'Unexpected error. Contact support.', 'far fa-error', 5000);
    } finally {
        currentCode.value = '';
    }
    redeeming.value = false;
}

</script>


<template>
    <SettingsTemplate v-if="!isGuest" :entries="entries" :key="project?.name || 'NONE'">
        <template #acodes>
            <div class="flex items-center gap-4">
                <LyxUiInput class="w-full px-4 py-2" placeholder="Appsumo code" v-model="currentCode"></LyxUiInput>
                <LyxUiButton v-if="!redeeming" :disabled="currentCode.length == 0" @click="redeemCode()" type="primary">
                    Redeem
                </LyxUiButton>
                <div v-if="redeeming">
                    Redeeming...
                </div>
            </div>
            <div class="text-lyx-text-darker mt-1 text-[.9rem] poppins">
                Redeemed codes: {{ valid_codes.data.value?.count || '0' }}
            </div>
            <div class="poppins text-[1.1rem] text-lyx-lightmode-text dark:text-yellow-400 mb-2">
                *Plan upgrades are applicable exclusively to this project(workspace).
            </div>
        </template>
    </SettingsTemplate>

    <div v-if="isGuest" class="text-lyx-text-darker flex w-full h-full justify-center mt-20">
        Guests cannot view billing
    </div>

</template>
