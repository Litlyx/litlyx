

const onlineUsers = await useFetch<number>(`/api/data/live_users`, {
    headers: useComputedHeaders({ useSnapshotDates: false }), immediate: false
});

let watching: any;

function startWatching(instant: boolean = true) {
    if (instant) onlineUsers.execute();
    watching = setInterval(async () => {
        onlineUsers.refresh();
    }, 20000);
}

function stopWatching() {
    if (watching) clearInterval(watching);
}

export function useOnlineUsers() {

    return {
        onlineUsers,
        startWatching,
        stopWatching
    }

}