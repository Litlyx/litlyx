
import type { TProject } from "@schema/ProjectSchema";

const projects = useFetch<TProject[]>('/api/project/list', { key: 'projectslist', ...signHeaders() });
export function useProjectsList() { return projects; }

const activeProjectId = useFetch<string>(`/api/user/active_project`, { key: 'activeProjectId', ...signHeaders() });
export function useActiveProjectId() { return activeProjectId; }

export function useActiveProject() {
    if (isLiveDemo()) {
        const { data: liveDemoProject } = useLiveDemo();
        return liveDemoProject;
    }
    const { data: projects } = useProjectsList();
    const { data: activeProjectId } = useActiveProjectId();
    return computed(() => {
        if (!projects.value) return;
        if (!activeProjectId.value) return;
        return projects.value.find(e => e._id.toString() == activeProjectId.value);
    });
}


export async function setActiveProject(project_id: string) {
    await $fetch<string>(`/api/user/set_active_project?project_id=${project_id}`, signHeaders());
    activeProjectId.refresh();
}
