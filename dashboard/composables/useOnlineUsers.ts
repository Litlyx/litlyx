

const onlineUsers = ref<number>(-1);

async function getOnlineUsers() {
    const activeProject = useActiveProject();
    if (!activeProject.value) return onlineUsers.value = -1;
    const online = await $fetch<number>(`/api/metrics/${activeProject.value._id}/live_users`, signHeaders());
    onlineUsers.value = online;
}

let watching: any;

function startWatching(instant: boolean = true) {
    if (instant) getOnlineUsers();
    watching = setInterval(async () => {
        await getOnlineUsers();
    }, 5000);
}

function stopWatching() {
    if (watching) clearInterval(watching);
}

export function useOnlineUsers() {

    return {
        onlineUsers,
        getOnlineUsers,
        startWatching,
        stopWatching
    }

}