<script lang="ts" setup>

const { data: links } = useFetch('/api/project/links/list', {
    headers: useComputedHeaders()
});

</script>

<template>
    <div>
        <div v-for="link of links">
            {{ link }}
        </div>
    </div>
</template>