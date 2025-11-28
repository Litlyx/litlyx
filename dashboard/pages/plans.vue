<script lang="ts" setup>


definePageMeta({ layout: 'sidebar' });
const projectStore = useProjectStore();

</script>

<template>
      <Unauthorized v-if="!projectStore.isOwner" authorization="Guest user limitation">
    </Unauthorized>
    <div v-else class="flex flex-col gap-8">
        <ManagePlans />
        <PlansCardQuestions/>
 </div>
</template>