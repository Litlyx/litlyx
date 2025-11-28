<script lang="ts" setup>

definePageMeta({ layout: 'sidebar' });

const activeTab = ref<string>('overview');
const { user } = useUserSession();

</script>
<template>
    <Unauthorized v-if="!user || user.email !== 'helplitlyx@gmail.com'" authorization="User Limitation">
    </Unauthorized>
    <div v-else class="p-4 h-full overflow-y-hidden">
        <Tabs v-model="activeTab" class="w-full h-full overflow-y-hidden">

            <TabsList class="w-full mb-4">
                <TabsTrigger value="overview">
                    Overview
                </TabsTrigger>
                <TabsTrigger value="feedbacks">
                    Feedbacks
                </TabsTrigger>
                <TabsTrigger value="onboarding">
                    Onboarding
                </TabsTrigger>
                <TabsTrigger value="aichats">
                    Ai Chats
                </TabsTrigger>
                <TabsTrigger value="backend">
                    Backend
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" class="overflow-y-hidden h-full">
                <LazyAdminOverview></LazyAdminOverview>
            </TabsContent>

            <TabsContent value="feedbacks" class="overflow-y-hidden h-full">
                <LazyAdminFeedbacks></LazyAdminFeedbacks>
            </TabsContent>

            <TabsContent value="onboarding" class="overflow-y-hidden h-full">
                <LazyAdminOnboarding></LazyAdminOnboarding>
            </TabsContent>


            <TabsContent value="aichats" class="overflow-y-hidden h-full">
                <LazyAdminAiChat></LazyAdminAiChat>
            </TabsContent>

            <TabsContent value="backend" class="overflow-y-hidden h-full">
                <LazyAdminBackend></LazyAdminBackend>
            </TabsContent>

        </Tabs>

    </div>
</template>