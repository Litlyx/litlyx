<script lang="ts" setup>

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

definePageMeta({ layout: 'sidebar' });

const route = useRoute();
const router = useRouter();

const activeTab = ref<string>(route.query.tab?.toString() ?? 'general');
router.push({ query: { tab: activeTab.value } });

watch(activeTab, () => {
    router.push({ query: { tab: activeTab.value } });
})

const projectStore = useProjectStore();

</script>

<template>
    <Unauthorized v-if="!projectStore.isOwner" authorization="Guest user limitation Workspace Settings">
    </Unauthorized>
    <div v-else class="poppins">
        <PageHeader title="Settings"
            description="Manage domains, preferences and controls to customize this workspace." />
            
        <Tabs v-model="activeTab" class="w-full mt-4">

            <TabsList class="w-full mb-4">
                <TabsTrigger value="general">
                    General
                </TabsTrigger>
                <TabsTrigger value="domains">
                    Domains
                </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
                <LazySettingsGeneral></LazySettingsGeneral>
            </TabsContent>

            <TabsContent value="domains">
                <LazySettingsDomains></LazySettingsDomains>
            </TabsContent>

        </Tabs>

    </div>
</template>