import type { TProject } from "@schema/ProjectSchema";

const projects = useFetch<TProject[]>('/api/project/list', {
    key: 'projectslist', ...signHeaders()
});



export function useProjectsList() {
    return { ...projects, projects: projects.data }
}


const activeProjectId = useFetch<string>(`/api/user/active_project`, {
    key: 'activeProjectId', ...signHeaders(),
});

export function useActiveProjectId() {
    return { ...activeProjectId, pid: activeProjectId.data }
}

export function useActiveProject() {
    if (isLiveDemo()) {
        const { data: liveDemoProject } = useLiveDemo();
        return liveDemoProject;
    }
    return computed(() => {
        if (!projects.data.value) return;
        if (!activeProjectId.data.value) return;
        const target = projects.data.value.find(e => e._id.toString() == activeProjectId.data.value);
        return target;
    });
}


export async function setActiveProject(project_id: string) {
    await $fetch<string>(`/api/user/set_active_project?project_id=${project_id}`, signHeaders());
    await activeProjectId.refresh();
}
