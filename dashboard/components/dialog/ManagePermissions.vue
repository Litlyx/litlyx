<script lang="ts" setup>

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { MemberWithPermissions } from '~/server/api/members/list';
import type { TPermission } from '~/shared/schema/TeamMemberSchema'
import { Toggle } from '@/components/ui/toggle'

const emits = defineEmits<{ (event: 'confirm', data: TPermission): void }>();
const props = defineProps<{ data: { member: MemberWithPermissions } }>();
const { close } = useDialog();

const domainStore = useDomainStore();

const currentPermission = ref<TPermission>({
    webAnalytics: props.data.member.permission.webAnalytics,
    events: props.data.member.permission.events,
    ai: props.data.member.permission.ai,
    domains: props.data.member.permission.domains
})


function onCheckboxClick(domain: string) {
    if (currentPermission.value.domains.includes(domain)) {
        const index = currentPermission.value.domains.indexOf(domain);
        currentPermission.value.domains.splice(index, 1);
    } else {
        currentPermission.value.domains.push(domain)
    }
}

</script>

<template>
<div class="flex flex-col gap-4">
        <div> Select user permissions </div>

        <div class="flex gap-3 justify-center">
            <Toggle v-model="currentPermission.webAnalytics" class="flex-1" variant="outline">
                <div> Web Analytics </div>
            </Toggle>
            <Toggle v-model="currentPermission.events" class="flex-1" variant="outline">
                <div> Events </div>
            </Toggle>
            <Toggle v-model="currentPermission.ai" class="flex-1" variant="outline">
                <div> AI </div>
            </Toggle>
        </div>

        <div> Select what domains is allowed to see </div>

        <div class="flex justify-center">
            <Tabs default-value="all" class="w-full">
                <TabsList class="flex justify-center w-full">
                    <TabsTrigger @click="currentPermission.domains = []" value="none">
                        No domains
                    </TabsTrigger>
                    <TabsTrigger @click="currentPermission.domains = ['*']" value="all">
                        All domains
                    </TabsTrigger>
                    <TabsTrigger @click="currentPermission.domains = []" value="custom">
                        Custom domains
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="none">
                    <div class="text-center">
                        The user cannot access any domain.
                    </div>
                </TabsContent>
                <TabsContent value="all">
                    <div class="text-center">
                        The user can access all domains.
                    </div>
                </TabsContent>
                <TabsContent value="custom">
                    <ScrollArea type="always" class="h-[15rem] flex flex-col gap-1 w-full mt-3">
                        <div @click="onCheckboxClick(domain.name)"
                            class="flex items-center gap-2 w-fit cursor-pointer select-none"
                            v-for="domain of domainStore.domains.filter(e => e._id !== '*')">
                            <Checkbox :model-value="currentPermission.domains.includes(domain.name)"></Checkbox>
                            <div> {{ truncateText(domain.name, 35) }} </div>
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>


        <div class="flex justify-end gap-2">
            <Button variant="secondary" @click="close()"> Cancel </Button>
            <Button @click="emits('confirm', currentPermission)"> Save </Button>
        </div>
    </div>
</template>