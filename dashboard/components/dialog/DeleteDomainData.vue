<script lang="ts" setup>

const emit = defineEmits(['success', 'cancel'])

const props = defineProps<{
    buttonType: string,
    message: string,
    deleteData: { isAll: boolean, visits: boolean, sessions: boolean, events: boolean, domain: string }
}>();

const isDone = ref<boolean>(false);

async function deleteData() {

    try {
        if (props.deleteData.isAll) {

        } else {
            await $fetch('/api/settings/delete_domain', {
                method: 'DELETE',
                headers: useComputedHeaders({ useSnapshotDates: false, custom: { 'Content-Type': 'application/json' } }).value,
                body: JSON.stringify({
                    domain: props.deleteData.domain,
                    visits: props.deleteData.visits,
                    sessions: props.deleteData.sessions,
                    events: props.deleteData.events,
                })
            })
        }
    } catch (ex) {
        alert('Something went wrong');
        console.error(ex);
    }

    isDone.value = true;
}

</script>

<template>
    <UModal :ui="{
        strategy: 'override',
        overlay: {
            background: 'bg-lyx-background/85'
        },
        background: 'bg-lyx-widget',
        ring: 'border-solid border-[1px] border-[#262626]'
    }">
        <div class="h-full flex flex-col gap-2 p-4">

            <div class="font-semibold text-[1.2rem]"> {{ isDone ? "Data Deletion Scheduled" : "Are you sure ?" }}</div>

            <div v-if="!isDone">
                {{ message }}
            </div>

            <div v-if="isDone">
                Your data deletion request is being processed and will be reflected in your project dashboard within a
                few minutes.
            </div>

            <div class="grow"></div>
            <div v-if="!isDone" class="flex justify-end gap-2">
                <LyxUiButton type="secondary" @click="emit('cancel')"> Cancel </LyxUiButton>
                <LyxUiButton @click="deleteData()" :type="buttonType"> Confirm </LyxUiButton>
            </div>

            <div v-if="isDone" class="flex justify-end w-full">
                <LyxUiButton type="secondary" @click="emit('success')"> Dismiss </LyxUiButton>
            </div>
        </div>
    </UModal>
</template>