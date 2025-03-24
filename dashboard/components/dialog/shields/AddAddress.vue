<script lang="ts" setup>

const emit = defineEmits(['success', 'cancel']);

const address = ref<string>('');
const description = ref<string>('');


const { data: currentIP } = useFetch<any>('https://api.ipify.org/?format=json');


const canAddAddress = computed(() => {
    return address.value.trim().length > 0;
})

async function addAddress() {
    if (!canAddAddress.value) return;
    try {
        const res = await $fetch('/api/shields/ip/add', {
            method: 'POST',
            headers: useComputedHeaders({}).value,
            body: JSON.stringify({ address: address.value, description: description.value })
        });
        address.value = '';
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

                <div class="font-semibold text-[1.1rem]"> Add IP to Block List </div>

                <div class="flex flex-col gap-2 dark:text-lyx-text-dark text-lyx-lightmode-text-dark">
                    <div> Your current IP address is: {{ currentIP?.ip || '...' }} </div>
                    <div> Copy and Paste your IP address in the box below or enter a custom address </div>
                </div>           

                <div class="flex flex-col gap-2">
                    <div class="font-medium"> IP Address </div>
                    <LyxUiInput class="px-2 py-1" v-model="address" placeholder="127.0.0.1"></LyxUiInput>
                </div>

                <div class="flex flex-col gap-2">
                    <div class="font-medium"> Description (optional) </div>
                    <LyxUiInput class="px-2 py-1" v-model="description" placeholder="e.g. localhost or office">
                    </LyxUiInput>
                </div>

                <div class="flex flex-col gap-2 dark:text-lyx-text-dark text-lyx-lightmode-text-dark">
                    <div> Once added, we will start rejecting traffic from this IP within a few minutes.</div>
                </div>

                <div class="flex">
                    <LyxUiButton class="w-full text-center" :disabled="!canAddAddress" @click="addAddress()"
                        type="primary">
                        Add IP Address
                    </LyxUiButton>
                </div>
            </div>

        </div>
    </UModal>

</template>