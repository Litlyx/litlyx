<script setup lang="ts">

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

import { ChevronsUpDown, Plus, Trash } from 'lucide-vue-next'
import DeleteSnapshot from '../dialog/DeleteSnapshot.vue';

import CreateSnapshot from '../dialog/CreateSnapshot.vue';

const snapshotStore = useSnapshotStore();
const domainStore = useDomainStore();

const dialog = useDialog();

const open = ref<boolean>(false);
const { isMobile } = useSidebar()


function showCreateSnapshotDialog() {
    open.value = false;
    dialog.open({
        body: CreateSnapshot,
        title: 'Create timeframe',
        async onSuccess(data, close) {

            await useCatch({
                toast: true,
                async action() {
                    return await useAuthFetchSync<void>('/api/snapshot/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: { name: data.name, color: data.color, from: new Date(data.from), to: new Date(data.to) }
                    });
                },
                async onSuccess(_, toast) {
                    toast('Snapshot created', { description: `Snapshot ${data.name} created` });
                    await snapshotStore.fetchSnapshots({ activateLast: true });
                }
            });

            close();
        }
    })
}

function showDialog(snapshot: GenericSnapshot) {
    open.value = false;
    dialog.open({
        body: DeleteSnapshot,
        title: 'Delete timeframe',
        props: { snapshot },
        async onSuccess(_, close) {

            await useCatch({
                toast: true,
                async action() {
                    return await useAuthFetchSync<void>('/api/snapshot/delete', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: { id: snapshot._id.toString() }
                    });
                },
                async onSuccess(data, toast) {
                    toast('Timeframe deleted', { description: `Timeframe ${snapshot.name} deleted` });
                    await snapshotStore.fetchSnapshots()
                }
            });

            close();
        },
    });

}

</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <Skeleton v-if="!snapshotStore.activeSnapshot || !domainStore.activeDomain" class="w-full h-12 p-2">
            </Skeleton>
            <DropdownMenu v-model:open="open" v-if="snapshotStore.activeSnapshot && domainStore.activeDomain">
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton size="lg"
                        class="px-4 cursor-pointer data-[state=open]:bg-sidebar-accent/50 data-[state=open]:text-sidebar-accent-foreground">
                        <div class="grid flex-1 text-left text-sm leading-tight">
                            <div class="flex items-center">
                                <div :style="`background-color:${snapshotStore.activeSnapshot.color};`"
                                    class="flex size-3 mr-[.4rem] rounded-full"> </div>
                                <div v-if="snapshotStore.activeSnapshot" class="truncate font-medium">
                                    {{ snapshotStore.activeSnapshot.name }}
                                </div>
                            </div>
                            <span v-if="snapshotStore.from && snapshotStore.to" class="truncate text-xs text-gray-400">
                                {{ new Date(snapshotStore.from).toLocaleDateString() }}
                                to
                                {{ new Date(snapshotStore.to).toLocaleDateString() }}
                            </span>
                        </div>
                        <ChevronsUpDown class="ml-auto" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start"
                    :side="isMobile ? 'bottom' : 'right'" :side-offset="4">
                    <DropdownMenuLabel class="text-xs text-gray-500 dark:text-gray-400">
                        Timeframes
                    </DropdownMenuLabel>

                    <div class="overflow-y-auto h-[20rem]">

                        <div class="flex items-center" v-for="item in snapshotStore.snapshots">
                            <DropdownMenuItem :key="item.name" class="flex gap-1 w-full p-0 my-0.5" 
                            :class="{'bg-sidebar-accent/50':item.name === snapshotStore.activeSnapshot.name}"
                            >
                                <div @click="snapshotStore.setActive(item._id.toString())"
                                    class="flex gap-2 grow p-2 items-center">
                                    <div :style="`background-color:${item.color};`"
                                        class="flex size-4 rounded-full border">
                                    </div>
                                    <div class="grow">
                                        {{ item.name }}
                                    </div>
                                </div>
                            </DropdownMenuItem>
                            <div class="py-2 px-1" v-if="!item._id.toString().startsWith('__')">
                                <Trash @click="showDialog(item)" class="size-4 hover:text-red-200 cursor-pointer">
                                </Trash>
                            </div>


                        </div>

                    </div>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="gap-2 p-2" @click="showCreateSnapshotDialog()">
                        <div
                            class="flex size-6 items-center justify-center rounded-md border border-gray-200 bg-transparent dark:border-gray-800">
                            <Plus class="size-4" />
                        </div>
                        <div class="font-medium">
                            Add timeframe
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
