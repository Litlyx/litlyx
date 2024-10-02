

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

const projectList = computed(() => projectsRequest.data.value);
const refreshProjectsList = () => projectsRequest.refresh();

const activeProjectId = ref<string | undefined>();

const setActiveProject = (project_id: string) => {
    activeProjectId.value = project_id;
    localStorage.setItem('active_pid', project_id);
}

const project = computed(() => {
    if (!projectList.value) return;
    if (projectList.value.length == 0) return;
    if (activeProjectId.value) {
        const target = projectList.value.find(e => e._id.toString() == activeProjectId.value);
        if (target) return target;
    }
    const savedActive = localStorage.getItem('active_pid');
    if (savedActive) {
        const target = projectList.value.find(e => e._id.toString() == savedActive);
        if (target) {
            activeProjectId.value = savedActive;
            return target;
        }
    }
    activeProjectId.value = projectList.value[0]._id.toString();
    return projectList.value[0];
})

export function useProject() {

    const actions = {
        refreshProjectsList,
        setActiveProject
    }

    return { project, projectList, actions, projectId: activeProjectId }
}