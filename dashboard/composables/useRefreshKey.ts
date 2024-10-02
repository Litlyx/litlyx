

const { project } = useProject()

export const refreshKey = computed(() => {
    if (!project.value) return 'null';
    return project.value._id.toString();
})