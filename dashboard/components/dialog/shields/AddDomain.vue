<script lang="ts" setup>

const domain = ref<string>('');
const canAdd = computed(() => domain.value.length > 0);
const loading = ref<boolean>(false);

const emits = defineEmits<{ (event: 'confirm', domain: string): void }>();

</script>

<template>
    <div class="flex flex-col gap-2">
        <Label class="text-base"> Add Domain to Allow List</Label>
        <Input v-model="domain"></Input>
        <div class="text-sm text-muted-foreground">
            You can use a wildcard (*) to match multiple hostnames.
            For example, *.domain.com will only record traffic on the main domain and all the subdomains.
        </div>
        <div class="text-sm text-muted-foreground">
            NB: Once added, we will start allowing traffic only from matching hostnames within a few minutes.
        </div>
        <Button v-if="loading" disabled>
            <Loader class="!size-6"></Loader>
        </Button>
        <Button v-else @click="emits('confirm', domain), loading = true" :disabled="!canAdd"> Add domain </Button>
    </div>
</template>