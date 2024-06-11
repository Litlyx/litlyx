<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });

const { projects, refresh } = useProjectsList();
const { pid } = useActiveProjectId();

const { data: maxProjects } = useFetch("/api/user/max_projects", signHeaders());

async function deleteProject(projectId: string, projectName: string) {
    const sure = confirm(`Are you sure to delete the project ${projectName} ?`);
    if (!sure) return;

    try {

        await $fetch('/api/project/delete', {
            method: 'DELETE',
            ...signHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ project_id: projectId })
        });

        await refresh();

        if (pid.value == projectId) {
            const firstProjectId = projects.value?.[0]?._id.toString();
            if (firstProjectId) {
                await setActiveProject(firstProjectId);
            }
        }

    } catch (ex: any) {
        alert(ex.message);
    }


}

const router = useRouter();

const { setToken } = useAccessToken();

async function onProjectClick(pid: string) {
    await setActiveProject(pid)
    router.push('/')
}

async function deleteAccount() {
    const sure = confirm("Are you sure you want to delete this account ?");
    if (!sure) return;
    await $fetch("/api/user/delete_account", {
        ...signHeaders(),
        method: "DELETE"
    })

    setToken('');
    location.href = "/login"
}

</script>


<template>

    <div class="h-full w-full pb-40 lg:pb-0 project-selector overflow-y-auto">

        <div class="flex flex-col justify-center mt-16 gap-10 px-10" v-if="projects">

            <div class="flex gap-4 items-center flex-col md:flex-row">
                <div class="flex gap-4 items-center">
                    <div class="text-text font-bold text-[1.5rem]"> Projects </div>
                    <div class="text-text-sub/90 text-[1rem] font-semibold lato">
                        {{ projects?.length ?? '-' }} / {{maxProjects || 3}}
                    </div>
                </div>
                <NuxtLink v-if="(projects?.length || 0) < (maxProjects || 3)" to="/project_creation"
                    class="bg-blue-500/20 hover:bg-blue-500/30 px-4 py-1 flex items-center gap-4 rounded-xl cursor-pointer">
                    <div class="h-full aspect-[1/1] flex items-center justify-center">
                        <i class="fas fa-plus text-[1rem] text-text-sub/80"></i>
                    </div>
                    <div>
                        <div class="text-text font-semibold manrope text-[1.3rem]"> Create new project</div>
                    </div>
                </NuxtLink>
            </div>

            <div class="text-text/85 mt-8 poppis text-[1.2rem]" v-if="projects.length == 0">
                Create your first project...
            </div>

            <div class="flex gap-12 flex-wrap" v-if="pid">

                <div v-for="e of projects">
                    <DashboardProjectSelectionCard @click="onProjectClick(e._id.toString())"
                        :active="pid == e._id.toString()" :title="e.name"
                        :subtitle="pid == e._id.toString() ? 'ATTIVO' : ''"
                        :chip="e.premium ? 'PREMIUM PLAN' : 'FREE PLAN'">
                    </DashboardProjectSelectionCard>
                    <div @click="deleteProject(e._id.toString(), e.name)"
                        class="mt-4 rounded-lg bg-[#3a3a3b] hover:bg-[#4f4f50] cursor-pointer hover:text-red-500 flex items-center justify-center py-3">
                        <i class="far fa-trash"></i>
                    </div>
                </div>


            </div>

        </div>

        <div class="px-10">
            <CardTitled title="Danger zone" :sub="''" class="p-4 mt-8">

                <div
                    class="outline rounded-lg w-fit px-8 py-4 flex flex-col gap-4 outline-[1px] outline-[#541c15] bg-[#1e1412]">
                    <div class="poppins font-semibold"> Deleting this account will also remove its projects </div>
                    <div @click="deleteAccount()"
                        class="text-[#e95b61] poppins font-semibold cursor-pointer hover:text-black hover:bg-red-700 outline rounded-lg w-fit px-8 py-2 outline-[1px] outline-[#532b26] bg-[#291415]">
                        Delete account
                    </div>
                </div>

            </CardTitled>
        </div>

    </div>

</template>
