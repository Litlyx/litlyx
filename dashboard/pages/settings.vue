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
                <SettingsGeneral :key="refreshKey"></SettingsGeneral>
            </template>
            <template #members>
                <SettingsMembers :key="refreshKey"></SettingsMembers>
            </template>
            <template #billing>
                <SettingsBilling :key="refreshKey"></SettingsBilling>
            </template>
            <template #account>
                <SettingsAccount :key="refreshKey"></SettingsAccount>
            </template>
        </CustomTab>

    </div>
</template>