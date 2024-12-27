<script lang="ts" setup>


const { project } = useProject();

const { onlineUsers, stopWatching, startWatching } = useOnlineUsers();
onMounted(() => startWatching());
onUnmounted(() => stopWatching());

const selfhosted = useSelfhosted();

const { createAlert } = useAlert();

function copyProjectId() {
    if (!navigator.clipboard) return alert('You can\'t copy in HTTP');
    if (!project.value) return alert('Project not loaded');
    navigator.clipboard.writeText((project.value._id).toString());
    createAlert('Success', 'Project id copied successfully.', 'far fa-circle-check', 5000);
}


function showAnomalyInfoAlert() {
    createAlert('AI Anomaly Detector info',
        `Anomaly detector is running. It helps you detect a spike in visits or events, it could mean an
         attack or simply higher traffic due to good performance. Additionally, it can detect if someone is
         stealing parts of your website and hosting a duplicate version—an unfortunately common practice.
         Litlyx will notify you via email with actionable advices`,
        'far fa-shield',
        10000
    )

}
</script>


<template>
    <div
        class="w-full px-6 pb-2 lg:pb-6 font-bold text-text-sub/40 flex flex-col xl:flex-row text-lg gap-2 xl:gap-12 lg:text-2xl">

        <div class="flex gap-2 items-center text-text/90 justify-center md:justify-start">
            <div class="animate-pulse w-[1rem] h-[1rem] bg-green-400 rounded-full"> </div>
            <div class="poppins font-medium text-[.9rem]"> {{ onlineUsers.data }} Online users</div>
        </div>

        <div class="grow"></div>

        <!-- <div class="flex md:gap-2 items-center md:justify-start flex-col md:flex-row">
            <div class="poppins font-medium text-lyx-text-darker text-[.9rem]">Project:</div>
            <div class="text-lyx-text poppins font-medium text-[.9rem]"> {{ project?.name || 'Loading...' }}
            </div>
        </div>

        <div class="flex flex-col md:flex-row md:gap-2 items-center md:justify-start">
            <div class="poppins font-medium text-lyx-text-darker text-[.9rem]">Project id:</div>
            <div class="flex gap-2">
                <div class="text-lyx-text poppins font-medium text-[.9rem]">
                    {{ project?._id || 'Loading...' }}
                </div>
                <div class="flex items-center ml-3">
                    <i @click="copyProjectId()"
                        class="far fa-copy text-lyx-text hover:text-lyx-primary cursor-pointer text-[.9rem]"></i>
                </div>
            </div>
        </div> -->

        <div v-if="!selfhosted" class="flex gap-2 items-center text-text/90 justify-center md:justify-start">
            <div class="animate-pulse w-[1rem] h-[1rem] bg-green-400 rounded-full"> </div>
            <div class="poppins font-regular text-[.9rem]"> AI Anomaly Detector </div>
            <div class="flex items-center">
                <i class="far fa-info-circle text-[.9rem] hover:text-lyx-primary cursor-pointer"
                    @click="showAnomalyInfoAlert"></i>
            </div>
        </div>

    </div>
</template>