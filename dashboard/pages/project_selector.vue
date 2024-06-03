<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });

const { projects, refresh } = useProjectsList();
const { pid } = useActiveProjectId();

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

async function onProjectClick(pid: string) {
    await setActiveProject(pid)
    router.push('/')
}

</script>


<template>

    <div class="h-full w-full pb-40 lg:pb-0 project-selector overflow-y-auto">

        <div class="flex flex-col justify-center mt-16 gap-10 px-10" v-if="projects">

            <div class="flex gap-4 items-center">
                <div class="text-text font-bold text-[1.5rem]"> Projects </div>
                <div class="text-text-sub/90 text-[1rem] font-semibold lato">
                    {{ projects?.length ?? '-' }} / 3
                </div>
                <NuxtLink v-if="(projects?.length || 0) < 3" to="/project_creation"
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

                <!--                 
                <div class="bg-blue-500/20 hover:bg-blue-500/30 p-4 w-[20rem] h-[6rem] flex items-center gap-4 rounded-xl cursor-pointer relative"
                    v-for="e of projects" @click="setActiveProject(e._id.toString())">
                    <div class="absolute right-2 top-2" v-if="project._id == e._id">
                        <i class="far fa-circle-check text-green-600"></i>
                    </div>
                    <div class="h-full aspect-[1/1]">
                        <div class="w-full h-full bg-blue-500 rounded-xl"></div>
                    </div>
                    <div>
                        <div class="text-text text-ellipsis line-clamp-1 font-semibold manrope text-[1.1rem]">
                            {{ e.name }}
                        </div>
                        <div class="text-text-sub font-normal lato text-[.9rem]">
                            {{ e.premium ? 'PREMIUM PLAN' : 'FREE PLAN' }}
                        </div>
                    </div>
                </div> -->

                <!-- <NuxtLink v-if="(projects?.length || 0) < 3" to="/project_creation"
                    class="bg-blue-500/20 hover:bg-blue-500/30 p-4 w-[20rem] h-[6rem] flex items-center gap-4 rounded-xl cursor-pointer">
                    <div class="h-full aspect-[1/1] flex items-center justify-center">
                        <i class="fas fa-plus text-[2rem] text-text-sub/80"></i>
                    </div>
                    <div>
                        <div class="text-text font-semibold manrope text-[1.1rem]"> Create new project</div>
                        <div class="text-text-sub font-normal lato text-[.9rem]"></div>
                    </div>
                </NuxtLink>  -->
            </div>

        </div>

    </div>

</template>
