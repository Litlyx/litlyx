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
    <div class="lg:px-10 lg:py-8 h-dvh overflow-y-auto overflow-x-hidden hide-scrollbars">
        
        <div class="poppins font-semibold text-[1.3rem] lg:px-0 px-4 lg:py-0 py-4"> Settings </div>

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