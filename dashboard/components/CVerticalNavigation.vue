<script lang="ts" setup>

import type { TProject } from '@schema/ProjectSchema';
import CreateSnapshot from './dialog/CreateSnapshot.vue';

export type Entry = {
    label: string,
    disabled?: boolean,
    to?: string,
    icon?: string,
    action?: () => any,
    adminOnly?: boolean,
    premiumOnly?:boolean,
    external?: boolean,
    grow?: boolean
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

const { setToken } = useAccessToken();
const router = useRouter();

function onLogout() {
    console.log('LOGOUT')
    setToken('');
    setLoggedUser(undefined);
    router.push('/login');
}

const { projects } = useProjectsList();
const activeProject = useActiveProject();


const { data: maxProjects } = useFetch("/api/user/max_projects", {
    headers: computed(() => {
        return {
            Authorization: authorizationHeaderComputed.value
        }
    })
});

const selected = ref<TProject>(activeProject.value as TProject);
watch(selected, () => {
    setActiveProject(selected.value._id.toString())
})

const isPremium = computed(()=>{
    return activeProject.value?.premium;
})

</script>

<template>
    <div class="CVerticalNavigation h-full w-[20rem] bg-lyx-background flex shadow-[1px_0_10px_#000000] rounded-r-lg"
        :class="{
            'absolute top-0 w-full md:w-[20rem] z-[45] open': isOpen,
            'hidden lg:flex': !isOpen
        }">
        <div class="py-4 px-2 gap-6 flex flex-col w-full">

            <div class="flex px-2 flex-col">

                <div class="flex items-center gap-2 w-full">

                    <USelectMenu :uiMenu="{
                        select: '!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter !ring-lyx-widget-lighter',
                        base: '!bg-lyx-widget',
                        option: {
                            base: 'hover:!bg-lyx-widget-lighter cursor-pointer',
                            active: '!bg-lyx-widget-lighter'
                        }
                    }" class="w-full" v-if="projects" v-model="selected" :options="projects">

                        <template #option="{ option, active, selected }">
                            <div class="flex items-center gap-2">
                                <div>
                                    <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'" alt="Litlyx logo">
                                </div>
                                <div> {{ option.name }} </div>
                            </div>
                        </template>

                        <template #label>
                            <div class="flex items-center gap-2">
                                <div>
                                    <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'" alt="Litlyx logo">
                                </div>
                                <div> {{ activeProject?.name || '???' }} </div>
                            </div>
                        </template>
                    </USelectMenu>

                    <div class="grow flex justify-end text-[1.4rem] mr-2 lg:hidden">
                        <i @click="close()" class="fas fa-close"></i>
                    </div>

                </div>

                <NuxtLink to="/project_creation" v-if="projects && (projects.length < (maxProjects || 1))"
                    class="flex items-center text-[.8rem] gap-1 justify-end pt-2 pr-2 text-lyx-text-dark hover:text-lyx-text cursor-pointer">
                    <div><i class="fas fa-plus"></i></div>
                    <div> Create new project </div>
                </NuxtLink>

            </div>


            <div class="w-full flex-col px-2">

                <div class="flex mb-2 items-center justify-between">
                    <div class="poppins text-[.8rem]">
                        Snapshots
                    </div>
                    <div @click="openSnapshotDialog()"
                        class="poppins text-[.8rem] px-2 rounded-lg outline outline-[2px] outline-lyx-widget-lighter cursor-pointer hover:bg-lyx-widget-lighter">
                        <i class="far fa-plus"></i>
                        Add
                    </div>
                </div>

                <USelectMenu :uiMenu="{
                    select: '!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter !ring-lyx-widget-lighter',
                    base: '!bg-lyx-widget',
                    option: {
                        base: 'hover:!bg-lyx-widget-lighter cursor-pointer',
                        active: '!bg-lyx-widget-lighter'
                    }
                }" class="w-full" v-model="snapshot" :options="snapshotsItems">
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

                <div v-if="snapshot" class="flex flex-col text-[.8rem] mt-2">
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

                    <LyxUiButton @click="generatePDF()" type="secondary" class="w-full text-center mt-4">
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

            <div class="bg-lyx-widget-lighter h-[2px] w-full"></div>

            <div class="flex flex-col h-full">

                <div v-for="section of sections" class="flex flex-col gap-1 h-full pb-6">

                    <div v-for="entry of section.entries" :class="{ 'grow flex items-end': entry.grow }">

                        <div v-if="(!entry.adminOnly || (isAdmin && !isAdminHidden))"
                            class="bg-lyx-background cursor-pointer text-lyx-text-dark py-[.35rem] px-2 rounded-lg text-[.95rem] flex items-center"
                            :class="{
                                '!text-lyx-text-darker pointer-events-none': entry.disabled,
                                'bg-lyx-background-lighter !text-lyx-text/90': route.path == (entry.to || '#'),
                                'hover:bg-lyx-background-light hover:!text-lyx-text/90': route.path != (entry.to || '#'),
                            }">

                            <NuxtLink @click="close() && entry.action?.()" :target="entry.external ? '_blank' : ''"
                                tag="div" class="w-full flex items-center" :to="entry.to || '/'">
                                <div class="flex items-center w-[1.4rem] mr-2 text-[1.1rem] justify-center">
                                    <i :class="entry.icon"></i>
                                </div>
                                <div class="manrope grow">
                                    {{ entry.label }}
                                </div>
                                <div v-if="entry.premiumOnly && !isPremium" class="flex items-center">
                                    <i class="fal fa-lock"></i>
                                </div>
                            </NuxtLink>

                        </div>

                    </div>

                </div>

                <div class="grow"></div>
                <div class="bg-lyx-widget-lighter h-[2px] px-4 w-full mb-3"></div>
                <div class="flex justify-end px-2">

                    <div class="grow flex gap-3">
                        <NuxtLink to="https://github.com/litlyx/litlyx" target="_blank"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fab fa-github"></i>
                        </NuxtLink>
                        <NuxtLink to="https://discord.gg/9cQykjsmWX" target="_blank"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fab fa-discord"></i>
                        </NuxtLink>
                        <NuxtLink to="https://x.com/litlyx" target="_blank"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fab fa-x-twitter"></i>
                        </NuxtLink>
                        <NuxtLink to="https://dev.to/litlyx-org" target="_blank"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fab fa-dev"></i>
                        </NuxtLink>
                        <NuxtLink to="/admin" v-if="isAdmin"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fas fa-cat"></i>
                        </NuxtLink>
                    </div>

                    <UTooltip text="Logout" :popper="{ arrow: true, placement: 'top' }">
                        <div @click="onLogout()" class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="far fa-arrow-right-from-bracket scale-x-[-100%]"></i>
                        </div>
                    </UTooltip>
                </div>



            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
input:focus {
    outline: none;
}
</style>