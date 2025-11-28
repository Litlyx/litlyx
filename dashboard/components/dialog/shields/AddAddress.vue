<script lang="ts" setup>

const address = ref<string>('');
const description = ref<string>('');
const canAdd = computed(() => address.value.length > 0);
const loading = ref<boolean>(false);

const emits = defineEmits<{ (event: 'confirm', data: { address: string, description: string }): void }>();

</script>

<template>
    <div class="flex flex-col gap-2">
        <Label class="text-base"> Add IP to Block List</Label>

        <Label> IP Address </Label>
        <Input v-model="address"></Input>
        <Label> Description </Label>
        <Input v-model="description"></Input>

        <div class="text-sm text-muted-foreground">
            Once added, we will start rejecting traffic from this IP within a few minutes.
        </div>

        <Button v-if="loading" disabled>
            <Loader class="!size-6"></Loader>
        </Button>

        <Button v-else @click="emits('confirm', { address, description }), loading = true" :disabled="!canAdd">
            Add IP Address
        </Button>
    </div>
</template>