<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });

const activeProject = useActiveProject();

const router = useRouter();

const newProjectName = ref<string>(activeProject.value?.name || "");

async function deleteProject(projectId: string, projectName: string) {
    const sure = confirm(`Are you sure to delete the project ${projectName} ?`);
    if (!sure) return;

    try {
        await $fetch('/api/project/delete', {
            method: 'DELETE',
            ...signHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ project_id: projectId })
        });
        // await refresh();
        // setActiveProject(0);
        router.push('/')
    } catch (ex: any) {
        alert(ex.message);
    }


}

onMounted(() => {

});



</script>


<template>

    <div class="settings w-full">

        <div class="flex flex-col justify-center mt-16 gap-10 px-10">

            <div class="text-text font-bold text-[1.5rem]"> Settings </div>

            <div class="flex gap-4 items-center text-[1.2rem] text-text-sub">
                <div class="font-semibold"> Name: </div>
                <div>
                    <input v-model="newProjectName" type="text" class="px-4 py-1 rounded-lg">
                </div>
            </div>

            <div class="flex mt-10">
                <div @click="deleteProject(((activeProject?._id || '') as string), (activeProject?.name || ''))"
                    class="bg-[#bd4747] hover:bg-[#c94b4b] rounded-lg px-6 py-2 text-white text-[.9rem] font-semibold inter cursor-pointer">
                    Delete
                </div>
            </div>

        </div>


    </div>

</template>


<style scoped lang="scss">
input:focus {
    outline: none;
}
</style>