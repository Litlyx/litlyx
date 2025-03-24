<script lang="ts" setup>

const emit = defineEmits(['success', 'cancel']);

const domain = ref<string>('');

const canAddDomain = computed(() => {
    return domain.value.trim().length > 0;
})

async function addDomain() {
    if (!canAddDomain.value) return;
    try {
        const res = await $fetch('/api/shields/domains/add', {
            method: 'POST',
            headers: useComputedHeaders({}).value,
            body: JSON.stringify({ domain: domain.value })
        });
        domain.value = '';
        emit('success');
    } catch (ex: any) {
        alert(ex.message);
        emit('cancel');
    }
}

</script>

<template>
    <UModal :ui="{
        strategy: 'override',
        overlay: {
            background: 'bg-lyx-background/85'
        },
        background: 'dark:bg-lyx-widget bg-lyx-lightmode-widget-light',
        ring: 'border-solid border-[1px] border-[#262626]'
    }">
        <div class="h-full flex flex-col gap-2 p-4">

            <div class="flex flex-col gap-3">

                <div class="font-semibold text-[1.1rem]"> Add Domain to Allow List </div>

                <LyxUiInput class="px-2 py-1" v-model="domain"></LyxUiInput>

                <div class="flex flex-col gap-2 dark:text-lyx-text-dark text-lyx-lightmode-text-dark">
                    <div>
                        <div> You can use a wildcard (*) to match multiple hostnames. </div>
                        <div> For example, *.domain.com will only record traffic on the main domain and all the
                            subdomains.
                        </div>
                    </div>
                    <div> NB: Once added, we will start allowing traffic only from matching hostnames within a few
                        minutes.</div>
                </div>

                <div class="flex">
                    <LyxUiButton class="w-full text-center" :disabled="!canAddDomain" @click="addDomain()" type="primary">
                        Add domain
                    </LyxUiButton>
                </div>
            </div>

        </div>
    </UModal>

</template>