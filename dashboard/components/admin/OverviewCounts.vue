<script lang="ts" setup>

const { data: counts } = useAuthFetch('/api/admin/counts');

</script>

<template>
    <div class="w-full">
        <div v-if="counts" class="flex justify-center gap-20">
            <div class="flex gap-4">
                <Label> Projects: {{ counts.projects }} </Label>
                <Label> Active: {{ counts.active }} </Label>
                <Label> Dead: {{ counts.dead }} </Label>
            </div>
              <div class="flex gap-4">
                <Label> Users: {{ counts.users }} </Label>
                <Label> Paid: {{ counts.paid }} </Label>
                <Label> Appsumo: {{ counts.appsumo }} </Label>
                <Label> Free: {{ counts.free_trial }} </Label>
                <Label> FreeEnd: {{ counts.free_trial_ended }} </Label>
            </div>
            <div class="flex gap-4">
                <Label> Visits: {{ formatNumberK(counts.visits, 2) }} </Label>
                <Label> Events: {{ formatNumberK(counts.events, 2) }} </Label>
            </div>
        </div>
    </div>
</template>