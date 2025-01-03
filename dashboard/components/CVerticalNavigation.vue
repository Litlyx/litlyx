<script lang="ts" setup>

import CreateSnapshot from './dialog/CreateSnapshot.vue';

export type Entry = {
    label: string,
    disabled?: boolean,
    to?: string,
    icon?: string,
    action?: () => any,
    adminOnly?: boolean,
    premiumOnly?: boolean,
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

const { userRoles, setLoggedUser } = useLoggedUser();
const { projectList } = useProject();

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
        headers: useComputedHeaders({ useSnapshotDates: false }).value,
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
            headers: useComputedHeaders({ useSnapshotDates: false, custom: { 'x-snapshot-name': snapshot.value.name } }).value,
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

const { data: maxProjects } = useFetch("/api/user/max_projects", {
    headers: computed(() => {
        return {
            Authorization: authorizationHeaderComputed.value
        }
    })
});


</script>

<template>
    <div class="CVerticalNavigation border-solid border-[#202020] border-r-[1px] h-full w-[20rem] bg-lyx-background flex shadow-[1px_0_10px_#000000] rounded-r-lg"
        :class="{
            'absolute top-0 w-full md:w-[20rem] z-[45] open': isOpen,
            'hidden lg:flex': !isOpen
        }">
        <div class="py-4 px-2 gap-6 flex flex-col w-full">

            <!-- <div class="flex px-2" v-if="!isPremium">
                <LyxUiButton type="primary" class="w-full text-center text-[.8rem] font-medium" @click="pricingDrawer.visible.value = true;">
                    Upgrade plan
                </LyxUiButton>
            </div> -->


            <div class="flex px-2 flex-col">

                <div class="flex items-center gap-2 w-full">

                    <ProjectSelector></ProjectSelector>

                    <div class="grow flex justify-end text-[1.4rem] mr-2 lg:hidden">
                        <i @click="close()" class="fas fa-close"></i>
                    </div>

                </div>


                <LyxUiButton to="/project_creation" v-if="projectList && (projectList.length < (maxProjects || 1))"
                    type="outlined" class="w-full py-1 mt-2 text-[.8rem]">
                    <div class="flex items-center gap-2 justify-center">
                        <div><i class="fas fa-plus text-[.7rem]"></i></div>
                        <div class="poppins"> New Project </div>
                    </div>
                </LyxUiButton>

                <LyxUiButton v-if="projectList && (projectList.length >= (maxProjects || 1))" type="outlined"
                    class="w-full py-1 mt-2 text-[.7rem]">
                    <div class="flex items-center gap-2 justify-center">
                        <div><i class="text-lyx-text-darker far fa-lock"></i></div>
                        <div class="text-lyx-text-darker"> Projects limit reached </div>
                    </div>
                </LyxUiButton>


            </div>


            <div class="w-full flex-col px-2">

                <div class="flex mb-2 items-center justify-between">
                    <div class="poppins text-[.8rem]">
                        Snapshots
                    </div>

                    <div class="flex gap-2">
                        <!-- <UTooltip text="Download report">
                            <LyxUiButton @click="generatePDF()" type="outlined" class="!px-3 !py-1">
                                <div><i class="far fa-download text-[.8rem]"></i></div>
                            </LyxUiButton>
                        </UTooltip> -->
                        <UTooltip text="Create new snapshot">
                            <LyxUiButton @click="openSnapshotDialog()" type="outlined" class="!px-3 !py-1">
                                <div><i class="fas fa-plus text-[.9rem]"></i></div>
                            </LyxUiButton>
                        </UTooltip>
                    </div>

                </div>

                <div class="flex items-center gap-2">
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
                </div>

                <div v-if="snapshot" class="flex flex-col text-[.7rem] mt-2">
                    <div class="flex gap-1 items-center justify-center text-lyx-text-dark">
                        <div class="poppins">
                            {{ new Date(snapshot.from).toLocaleString().split(',')[0].trim() }}
                        </div>
                        <div class="poppins"> to </div>
                        <div class="poppins">
                            {{ new Date(snapshot.to).toLocaleString().split(',')[0].trim() }}
                        </div>
                    </div>

                    <div class="mt-2" v-if="('default' in snapshot == false)">
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

                <div class="w-full flex mt-4">
                    <LyxUiButton type="outline" class="w-full text-center text-[.7rem]">
                        Export report
                    </LyxUiButton>
                </div>

            </div>

            <div class="bg-[#202020] h-[1px] w-full"></div>

            <div class="flex flex-col h-full">

                <div v-for="section of sections" class="flex flex-col gap-1 h-full pb-6">

                    <div v-for="entry of section.entries" :class="{ 'grow flex items-end': entry.grow }">

                        <div v-if="(!entry.adminOnly || (userRoles.isAdmin.value && !isAdminHidden))"
                            class="bg-lyx-background w-full cursor-pointer text-lyx-text-dark py-[.35rem] px-2 rounded-lg text-[.95rem] flex items-center"
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
                                <div v-if="entry.premiumOnly && !userRoles.isPremium.value" class="flex items-center">
                                    <i class="fal fa-lock"></i>
                                </div>
                            </NuxtLink>

                        </div>

                    </div>

                </div>

                <div class="grow"></div>

                <div class="bg-[#202020] h-[1px] w-full px-4  mb-3"></div>

                <div class="flex justify-end px-2">

                    <div class="grow flex gap-3">
                        <!-- <NuxtLink to="https://github.com/litlyx/litlyx" target="_blank"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fab fa-github"></i>
                        </NuxtLink> -->
                        <!-- <NuxtLink to="https://discord.gg/9cQykjsmWX" target="_blank"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fab fa-discord"></i>
                        </NuxtLink> -->
                        <NuxtLink to="https://x.com/litlyx" target="_blank"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fab fa-x-twitter"></i>
                        </NuxtLink>
                        <!-- <NuxtLink to="https://dev.to/litlyx-org" target="_blank"
                            class="cursor-pointer hover:text-lyx-text text-lyx-text-dark">
                            <i class="fab fa-dev"></i>
                        </NuxtLink> -->

                        <NuxtLink to="/admin" v-if="userRoles.isAdmin.value"
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