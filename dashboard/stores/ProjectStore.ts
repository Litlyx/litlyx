import type { TPendingInvite } from "~/server/api/members/pending";
import type { TProject } from "~/shared/schema/project/ProjectSchema";
import type { TPermission } from "~/shared/schema/TeamMemberSchema";

export const useProjectStore = defineStore('project', () => {

    const projects = shallowRef<(TProject & { guest?: boolean })[]>([]);
    const activeProject = shallowRef<(TProject & { guest?: boolean })>();
    const pid = computed(() => activeProject.value?._id.toString());
    const permissions = ref<TPermission>();
    const isOwner = computed(() => !activeProject.value?.guest);

    const firstInteraction = ref<boolean>(false);

    const pendingInvites = ref<TPendingInvite[]>([]);

    const isActiveProjectGuest = computed(() => {
        const target = projects.value.find(e => e._id.toString() === pid.value);
        if (!target) return false;
        return target.guest === true;
    })


    function getLocalSavedProject() {
        return localStorage.getItem(`litlyx_preference_last_project_selected`);
    }

    function setLocalSavedProject(save_pid: string) {
        localStorage.setItem(`litlyx_preference_last_project_selected`, save_pid);
    }

    async function fetchPendingInvites() {
        try {
            const result = await useAuthFetchSync<TPendingInvite[]>('/api/members/pending');
            pendingInvites.value = result;
        } catch (ex) {

        }
    }

    async function fetchProjects() {

        const [res, resGuest] = await Promise.all([
            useAuthFetchSync<TProject[]>('/api/project/list'),
            useAuthFetchSync<TProject[]>('/api/project/list_guest')
        ]);

        projects.value = [...res, ...resGuest.map(e => ({ ...e, guest: true }))];

        if (res.length > 0) {
            const saved = getLocalSavedProject();
            if (saved) {
                const index = projects.value.findIndex(e => e._id.toString() === saved);
                if (index == -1) {
                    activeProject.value = projects.value[0];
                    await fetchFirstInteraction();
                    return;
                }
                activeProject.value = projects.value[index];
                await fetchFirstInteraction();
                return;
            }
            activeProject.value = projects.value[0];
            await fetchFirstInteraction();
        }

    }

    async function fetchFirstInteraction() {
        try {
            firstInteraction.value = await useAuthFetchSync<boolean>('/api/project/first_interaction');
            console.log('First interaction:', firstInteraction.value)
            return firstInteraction.value;

        } catch (ex) {
            console.log('Cannot get first interaction data');
            console.error(ex);
        }
    }

    async function fetchActivePermissions() {
        permissions.value = await useAuthFetchSync<TPermission>('/api/members/me');
        return permissions.value;
    }

    async function setActive(pid: string) {

        console.log('SETTING ACTIVE PROJECT', pid);

        activeProject.value = projects.value.find(e => pid === e._id.toString());
        setLocalSavedProject(pid);

        const domainStore = useDomainStore();
        const snapshotStore = useSnapshotStore();

        await fetchFirstInteraction(),

            await Promise.all([
                domainStore.fetchDomains(),
                snapshotStore.fetchSnapshots(),
                fetchActivePermissions(),
            ]);

    }

    return {
        isActiveProjectGuest,
        projects,
        activeProject,
        pid,
        fetchActivePermissions,
        fetchProjects,
        setActive,
        permissions,
        isOwner,
        fetchPendingInvites,
        pendingInvites,
        firstInteraction,
        fetchFirstInteraction
    }
})