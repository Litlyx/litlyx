<script lang="ts" setup>

const router = useRouter();
const route = useRoute();

onMounted(async () => {
    try {
        const project_id = route.query.project_id;
        if (!project_id) throw Error('project_id is required');
        const res = await $fetch('/api/project/members/accept', {
            headers: useComputedHeaders({
                custom: {
                    'Content-Type': 'application/json'
                }
            }).value,
            method: 'POST',
            body: JSON.stringify({ project_id })
        });
        router.push('/');
    } catch (ex) {
        console.error('ERROR');
        console.error(ex);
        alert('An error occurred');
    }
});


</script>

<template>
    <div>
        You will be redirected soon.
    </div>
</template>