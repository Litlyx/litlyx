

import type { TProject } from "@schema/ProjectSchema";
import { ProjectSnapshotModel } from "@schema/ProjectSnapshot";

const { token } = useAccessToken();

const projectsRequest = useFetch<TProject[]>('/api/project/list', {
    headers: computed(() => {
        return {
            'Authorization': `Bearer ${token.value}`
        }
    })
});

const guestProjectsRequest = useFetch<TProject[]>('/api/project/list_guest', {
    headers: computed(() => {
        return {
            'Authorization': `Bearer ${token.value}`
        }
    })
});

const projectList = computed(() => {
    return projectsRequest.data.value;
});

const allProjectList = computed(() => {
    return [...(projectsRequest.data.value || []), ...(guestProjectsRequest.data.value || [])]
})

const guestProjectList = computed(() => {
    return guestProjectsRequest.data.value;
})

const refreshProjectsList = () => projectsRequest.refresh();

const activeProjectId = ref<string | undefined>();

const setActiveProject = (project_id: string) => {
    activeProjectId.value = project_id;
    localStorage.setItem('active_pid', project_id);
}

const project = computed(() => {

    if (isLiveDemo.value) return useLiveDemo().data.value;

    if (!allProjectList.value) return;
    if (allProjectList.value.length == 0) return;

    if (activeProjectId.value) {
        const target = allProjectList.value.find(e => e._id.toString() == activeProjectId.value);
        if (target) return target;
    }

    const savedActive = localStorage.getItem('active_pid');
    if (savedActive) {
        const target = allProjectList.value.find(e => e._id.toString() == savedActive);
        if (target) {
            activeProjectId.value = savedActive;
            return target;
        }
    }
    activeProjectId.value = allProjectList.value[0]._id.toString();
    return allProjectList.value[0];
})

const projectId = computed(() => project.value?._id.toString())


const isGuest = computed(() => {
    return (projectList.value || []).find(e => e._id.toString() === activeProjectId.value) == undefined;
})

export function useProject() {

    const actions = {
        refreshProjectsList,
        setActiveProject
    }

    return { project, allProjectList, guestProjectList, projectList, actions, projectId, isGuest }
}