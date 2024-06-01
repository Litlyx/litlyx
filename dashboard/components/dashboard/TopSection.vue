<script lang="ts" setup>

const activeProject = useActiveProject();
const { onlineUsers, stopWatching, startWatching } = useOnlineUsers();
onMounted(()=> startWatching());
onUnmounted(() => stopWatching());


function copyProjectId() {
    if (!navigator.clipboard) alert('NON PUOI COPIARE IN HTTP');
    navigator.clipboard.writeText((activeProject.value?._id || 0).toString());
    alert('Copiato !');
}
</script>


<template>
    <div
        class="w-full px-6 py-2 lg:py-6 font-bold text-text-sub/40 flex flex-col xl:flex-row text-lg lg:text-2xl gap-2 xl:gap-12">

        <div class="flex gap-2 items-center text-text/90">
            <div class="animate-pulse w-[1rem] h-[1rem] bg-green-400 rounded-full"> </div>
            <div> {{ onlineUsers }} Online users</div>
        </div>

        <div class="grow"></div>

        <div class="flex gap-2">
            <div>Project:</div>
            <div class="text-text/90"> {{ activeProject?.name || 'Loading...' }} </div>
        </div>
        <div class="flex gap-2">
            <div>Project id:</div>
            <div class="text-text/90 text-[.9rem] lg:text-2xl">
                {{ activeProject?._id || 'Loading...' }}
            </div>
            <div class="flex items-center ml-3">
                <i @click="copyProjectId()" class="far fa-copy hover:text-text cursor-pointer text-[1.2rem]"></i>
            </div>
        </div>
    </div>
</template>