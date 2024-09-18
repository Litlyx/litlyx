<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });


const activeProject = useActiveProject();

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
                <SettingsGeneral :key="activeProject?._id.toString()"></SettingsGeneral>
            </template>
            <template #members>
                <SettingsMembers :key="activeProject?._id.toString()"></SettingsMembers>
            </template>
            <template #billing>
                <SettingsBilling :key="activeProject?._id.toString()"></SettingsBilling>
            </template>
            <template #account>
                <SettingsAccount :key="activeProject?._id.toString()"></SettingsAccount>
            </template>
        </CustomTab>

    </div>
</template>