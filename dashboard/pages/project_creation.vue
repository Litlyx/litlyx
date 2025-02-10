<script setup lang="ts">


const projectName = ref<string>("");
const creating = ref<boolean>(false);

const router = useRouter();

const { projectList, actions } = useProject();
const isFirstProject = computed(() => { return projectList.value?.length == 0; })

definePageMeta({ layout: 'none' });


import { Lit } from 'litlyx-js';

const route = useRoute();

onMounted(() => {
    if (route.query.just_logged) return location.href = '/project_creation';
    setPageLayout(isFirstProject.value ? 'none' : 'dashboard');
})


async function createProject() {
    if (projectName.value.length < 2) return;

    Lit.event('create_project');

    creating.value = true;

    try {

        await $fetch('/api/project/create', {
            method: 'POST',
            ...signHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ name: projectName.value })
        });

        await actions.refreshProjectsList();

        const newActiveProjectId = projectList.value?.[projectList.value?.length - 1]._id.toString();
        if (newActiveProjectId) {
            await actions.setActiveProject(newActiveProjectId);
        }

        setPageLayout('dashboard');
        router.push('/');

    } catch (ex: any) {
        alert(ex.message);
    }

    creating.value = false;


}


</script>


<template>

    <div class="home relative h-full overflow-y-auto lg:overflow-hidden">

        <div class="absolute w-full h-full z-[8] flex justify-center items-center">
            <HomeBgGrid :size="120" :spacing="12" opacity="0.2"></HomeBgGrid>
        </div>

        <div class="flex flex-col items-center justify-center pt-[12rem] gap-12 relative z-[10]">

            <div class="text-[3rem] font-semibold text-center text-lyx-lightmode-text dark:text-lyx-text">
                Create {{ isFirstProject ? '' : 'a new' }} {{ isFirstProject ? 'your first' : '' }} project
            </div>

            <div v-if="isFirstProject" class="text-[1.5rem]">
                Welcome to Litlyx. Setup your project in less than 30 seconds.
            </div>

            <div class="w-[20rem] flex flex-col gap-2">
                <div class="text-lg text-lyx-lightmode-text-dark dark:text-text-sub font-semibold">
                    {{ isFirstProject ? 'Choose a name' : 'Project name' }}
                </div>
                <!-- <CInput placeholder="ProjectName" :readonly="creating" v-model="projectName"></CInput> -->
                <LyxUiInput class="py-2 px-2" placeholder="Insert" :readonly="creating" v-model="projectName">
                </LyxUiInput>
            </div>

            <div>

                <LyxUiButton type="primary" @click="createProject()" :disabled="projectName.length < 2">
                    Create
                </LyxUiButton>

            </div>

        </div>

    </div>

</template>
