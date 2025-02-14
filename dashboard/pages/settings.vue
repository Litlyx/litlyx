<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

const selfhosted = useSelfhosted();

const items = [
    { label: 'General', slot: 'general', tab: 'general' },
    { label: 'Domains', slot: 'domains', tab: 'domains' },
    { label: 'Members', slot: 'members', tab: 'members' },
    { label: 'Billing', slot: 'billing', tab: 'billing' },
    { label: 'Codes', slot: 'codes', tab: 'codes' },
    { label: 'Account', slot: 'account', tab: 'account' }
]

</script>

<template>
    <div class="lg:px-10 lg:py-8 h-dvh overflow-y-auto overflow-x-hidden hide-scrollbars !pb-[10rem]">

        <div class="poppins font-semibold text-[1.3rem] lg:px-0 px-4 lg:py-0 py-4"> Settings </div>

        <CustomTab :items="items" :route="true" class="mt-8">
            <template #general>
                <SettingsGeneral :key="refreshKey"></SettingsGeneral>
            </template>
            <template #domains>
                <SettingsData :key="refreshKey"></SettingsData>
            </template>
            <template #members>
                <SettingsMembers :key="refreshKey"></SettingsMembers>
            </template>
            <template #billing>
                <SettingsBilling v-if="!selfhosted" :key="refreshKey"></SettingsBilling>
                <div class="flex popping text-[1.2rem] font-semibold justify-center mt-[20vh] text-lyx-lightmode-text dark:text-lyx-text"
                    v-if="selfhosted">
                    Billing disabled in self-host mode
                </div>
            </template>
            <template #codes>
                <SettingsCodes v-if="!selfhosted" :key="refreshKey"></SettingsCodes>
                <div class="flex popping text-[1.2rem] font-semibold justify-center mt-[20vh] text-lyx-lightmode-text dark:text-lyx-text"
                    v-if="selfhosted">
                    Codes disabled in self-host mode
                </div>
            </template>
            <template #account>
                <SettingsAccount :key="refreshKey"></SettingsAccount>
            </template>
        </CustomTab>

    </div>
</template>