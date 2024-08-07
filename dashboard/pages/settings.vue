<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });


const items = [
    { label: 'General', slot: 'general' },
    { label: 'Members', slot: 'members' },
    { label: 'Billing', slot: 'billing' },
    { label: 'Account', slot: 'account' }
]

</script>

<template>
    <div class="px-10 py-8 h-dvh overflow-y-auto hide-scrollbars">
        <div class="poppins font-semibold text-[1.3rem]"> Settings </div>

        <CustomTab :items="items" class="mt-8">
            <template #general>
                <SettingsGeneral></SettingsGeneral>
            </template>
            <template #members>
                <SettingsMembers></SettingsMembers>
            </template>
            <template #billing>
                <SettingsBilling></SettingsBilling>
            </template>
            <template #account>
                <SettingsAccount></SettingsAccount>
            </template>
        </CustomTab>

        <!-- <UTabs :items="items" class="mt-8">
            <template #general>
                <SettingsGeneral></SettingsGeneral>
            </template>
            <template #members>
                <SettingsMembers></SettingsMembers>
            </template>
            <template #billing>
                <SettingsBilling></SettingsBilling>
            </template>
            <template #account>
                <SettingsAccount></SettingsAccount>
            </template>
        </UTabs> -->
    </div>
</template>