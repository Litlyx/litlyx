<script lang="ts" setup>

definePageMeta({ layout: 'dashboard' });

const selfhosted = useSelfhosted();

const items = [
    { label: 'Domains', slot: 'domains', tab: 'domains' },
    { label: 'IP Addresses', slot: 'ipaddresses', tab: 'ipaddresses' },
    { label: 'Countries', slot: 'countries', tab: 'countries' },
    { label: 'Pages', slot: 'pages', tab: 'pages' },
]

</script>

<template>
    <div class="lg:px-10 h-full lg:py-8 overflow-hidden hide-scrollbars">

        <div class="poppins font-semibold text-[1.3rem] lg:px-0 px-4 lg:py-0 py-4"> Shields </div>

        <CustomTab :items="items" :route="true" class="mt-8">
            <template #domains>
                <ShieldsDomains></ShieldsDomains>
            </template>
            <template #ipaddresses>
                <div class="flex items-center justify-center py-20 text-[1.2rem]"> Coming soon </div>
                <!-- <ShieldsAddresses></ShieldsAddresses> -->
            </template>
            <template #countries>
                <div class="flex items-center justify-center py-20 text-[1.2rem]"> Coming soon </div>
            </template>
            <template #pages>
                <div class="flex items-center justify-center py-20 text-[1.2rem]"> Coming soon </div>
            </template>
        </CustomTab>

    </div>
</template>