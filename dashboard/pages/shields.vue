<script lang="ts" setup>

definePageMeta({ layout: 'sidebar' });

const activeTab = ref<any>('domains');
const projectStore = useProjectStore();

</script>

<template>
          <Unauthorized v-if="!projectStore.isOwner" authorization="Guest user limitation Shields">
    </Unauthorized>
    <div v-else class=" poppins">
<PageHeader title="Shields" 
description="Exclude specific domains, internal IP addresses, and bot traffic (including crawlers) to keep your analytics focused on real users."/>
        <Tabs v-model="activeTab" class="w-full mt-4">

            <TabsList class="w-full mb-4">
                <TabsTrigger value="domains">
                    Domains
                </TabsTrigger>
                <TabsTrigger value="ips">
                    IP Addresses
                </TabsTrigger>
                <TabsTrigger value="bot">
                    Bot traffic
                </TabsTrigger>
            </TabsList>

            <TabsContent value="domains">
                <LazyShieldsDomains></LazyShieldsDomains>
            </TabsContent>

            <TabsContent value="ips">
                <LazyShieldsAddresses></LazyShieldsAddresses>
            </TabsContent>

            <TabsContent value="bot">
               <LazyShieldsBots></LazyShieldsBots>
            </TabsContent>

        </Tabs>

    </div>
</template>