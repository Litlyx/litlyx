<script lang="ts" setup>

import CreateSnapshot from './dialog/CreateSnapshot.vue';

export type Entry = {
    label: string,
    disabled?: boolean,
    to?: string,
    icon?: string,
    action?: () => any,
    adminOnly?: boolean,
    external?: boolean
}

export type Section = {
    title: string,
    entries: Entry[]
}

type Props = {
    sections: Section[]
}

const route = useRoute();
const props = defineProps<Props>();

const { isAdmin } = useUserRoles();

const debugMode = process.dev;

const { isOpen, close } = useMenu();

const { snapshots, snapshot, updateSnapshots } = useSnapshot();

const snapshotsItems = computed(() => {
    if (!snapshots.value) return []
    return snapshots.value as any[];
})


const { openDialogEx } = useCustomDialog();

function openSnapshotDialog() {
    openDialogEx(CreateSnapshot, {
        width: "24rem",
        height: "16rem",
        closable: false
    });
}

const { createAlert } = useAlert()

async function deleteSnapshot(close: () => any) {
    await $fetch("/api/snapshot/delete", {
        method: 'DELETE',
        ...signHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
            id: snapshot.value._id.toString(),
        })
    });
    await updateSnapshots();
    snapshot.value = snapshots.value[1];
    createAlert('Snapshot deleted', 'Snapshot deleted successfully', 'far fa-circle-check', 5000);
    close();
}

async function generatePDF() {

try {
    const res = await $fetch<Blob>('/api/project/generate_pdf', {
        ...signHeaders(),
        responseType: 'blob'
    });

    const url = URL.createObjectURL(res);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report.pdf`;
    a.click();
    URL.revokeObjectURL(url);
} catch (ex: any) {
    alert(ex.message);
}
}


</script>

<template>
    <div class="CVerticalNavigation h-full w-[20rem] bg-lyx-background flex shadow-[1px_0_10px_#000000] rounded-r-lg"
        :class="{
            'absolute top-0 w-full md:w-[20rem] z-[45] open': isOpen,
            'hidden lg:flex': !isOpen
        }">
        <div class="p-4 gap-6 flex flex-col w-full">

            <div class="flex items-center gap-2 ml-2">
                <div class="bg-black h-[2.4rem] aspect-[1/1] flex items-center justify-center rounded-lg">
                    <img class="h-[2rem]" :src="'/logo.png'">
                </div>
                <div class="font-bold text-[1.4rem] text-gray-300"> Litlyx </div>

                <div class="grow flex justify-end text-[1.4rem] mr-2 lg:hidden">
                    <i @click="close()" class="fas fa-close"></i>
                </div>

            </div>

            <div class="px-4 w-full flex-col">

                <div class="flex mb-2 px-2 items-center justify-between">
                    <div class="poppins text-[.8rem]">
                        Snapshots
                    </div>
                    <div @click="openSnapshotDialog()"
                        class="poppins text-[.8rem] px-2 rounded-lg outline outline-[2px] outline-lyx-widget-lighter cursor-pointer hover:bg-lyx-widget-lighter">
                        <i class="far fa-plus"></i>
                        Add
                    </div>
                </div>

                <USelectMenu class="w-full" v-model="snapshot" :options="snapshotsItems">
                    <template #label>
                        <div class="flex items-center gap-2">
                            <div :style="'background-color:' + snapshot?.color" class="w-2 h-2 rounded-full">
                            </div>
                            <div class="poppins"> {{ snapshot?.name }} </div>
                        </div>
                    </template>
                    <template #option="{ option }">
                        <div class="flex items-center gap-2">
                            <div :style="'background-color:' + option.color" class="w-2 h-2 rounded-full">
                            </div>
                            <div class="poppins"> {{ option.name }} </div>
                        </div>
                    </template>
                </USelectMenu>

                <div v-if="snapshot" class="flex flex-col text-[.8rem] mt-2 px-2">
                    <div class="flex">
                        <div class="grow poppins"> From:</div>
                        <div class="poppins"> {{ new Date(snapshot.from).toLocaleString('it-IT').split(',')[0].trim() }}
                        </div>
                    </div>
                    <div class="flex">
                        <div class="grow poppins"> To:</div>
                        <div class="poppins"> {{ new Date(snapshot.to).toLocaleString('it-IT').split(',')[0].trim() }}
                        </div>
                    </div>

                    <LyxUiButton @click="generatePDF()" type="primary" class="w-full text-center mt-4">
                        Download report
                    </LyxUiButton>

                    <div class="mt-2" v-if="snapshot._id.toString().startsWith('default') === false">
                        <UPopover placement="bottom">
                            <LyxUiButton type="danger" class="w-full text-center">
                                Delete current snapshot
                            </LyxUiButton>

                            <template #panel="{ close }">
                                <div class="p-4 bg-lyx-widget">
                                    <div class="poppins text-center font-medium">
                                        Are you sure?
                                    </div>
                                    <div class="flex gap-2 mt-4">
                                        <LyxUiButton @click="close()" type="secondary"> Cancel </LyxUiButton>
                                        <LyxUiButton type="danger" @click="deleteSnapshot(close)"> Delete </LyxUiButton>
                                    </div>
                                </div>
                            </template>
                        </UPopover>

                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-4">

                <div v-for="section of sections" class="flex flex-col gap-1">

                    <div v-for="entry of section.entries">

                        <div v-if="(!entry.adminOnly || (isAdmin && !isAdminHidden))"
                            class="bg-lyx-background text-gray-300 py-2 px-4 rounded-lg" :class="{
                                'text-gray-700 pointer-events-none': entry.disabled,
                                'bg-lyx-background-lighter': route.path == (entry.to || '#'),
                                'hover:bg-lyx-background-light': route.path != (entry.to || '#')
                            }">

                            <NuxtLink @click="close() && entry.action?.()" :target="entry.external ? '_blank' : ''"
                                tag="div" class="flex" :to="entry.to || '/'">
                                <div class="flex items-center w-[1.8rem] justify-start">
                                    <i :class="entry.icon"></i>
                                </div>
                                <div class="manrope">
                                    {{ entry.label }}
                                </div>
                            </NuxtLink>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.CVerticalNavigation * {
    font-family: 'Geist';
}

input:focus {
    outline: none;
}
</style>