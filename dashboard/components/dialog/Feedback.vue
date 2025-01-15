<script lang="ts" setup>

const { createAlert } = useAlert();
const { close } = useModal()

const text = ref<string>("");

async function sendFeedback() {
    if (text.value.length < 5) return;
    try {

        const res = await $fetch('/api/feedback/add', {
            headers: useComputedHeaders({
                useSnapshotDates: false,
                custom: { 'Content-Type': 'application/json' }
            }).value,
            method:'POST',
            body: JSON.stringify({ text: text.value })
        });

        createAlert('Success', 'Feedback sent successfully.', 'far fa-circle-check', 5000);

        close();
    } catch (ex) {
        console.error(ex);
        createAlert('Error', 'Error sending feedback. Please try again later', 'far fa-triangle-exclamation', 5000);
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
                <div> Share everything with us. </div>
                <textarea v-model="text" placeholder="Leave your feedback"
                    class="p-2 w-full h-[8rem] dark:bg-lyx-widget bg-lyx-lightmode-widget-light resize-none rounded-md outline outline-[2px] outline-[#3a3f47]"></textarea>
                <div class="flex justify-between items-center">
                    <div>Need help ? Check the docs <a href="https://docs.litlyx.com" target="_blank"
                            class="text-blue-500">here</a> </div>
                    <LyxUiButton :disabled="text.length < 5" @click="sendFeedback()" type="primary"> Send </LyxUiButton>
                </div>
            </div>
        </div>
    </UModal>

</template>