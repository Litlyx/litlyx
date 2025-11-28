<script lang="ts" setup>

import type { ReadableChatMessage } from '~/pages/ai.vue';
import AssistantMessage from './AssistantMessage.vue';
import { CircleAlert } from 'lucide-vue-next';

const ai_chats_component = useTemplateRef<HTMLDivElement>('ai_chats');

const props = defineProps<{
    messages?: ReadableChatMessage[],
    status?: string,
}>();

const emits = defineEmits<{
    (event: 'downvoted', message_index: number): void;
    (event: 'chatdeleted'): void;
}>();

function scrollToBottom() {
    setTimeout(() => {
        ai_chats_component.value?.scrollTo({ top: 999999, behavior: 'smooth' });
    }, 150);
}
watch(props, async () => {
    scrollToBottom();
})
</script>

<template>
    <div class="flex flex-col gap-2 overflow-y-auto overflow-x-hidden" ref="ai_chats">



        <div v-for="(message, index) of messages" class="flex flex-col relative">

            <div class="w-full flex justify-end" v-if="message.role === 'user'">
                <div class="border rounded-md p-2 flex flex-col gap-2 flex-end w-[70%] bg-white dark:bg-black">
                    <div class="flex gap-2 items-center">
                        <Label> {{ message.name ?? 'User' }} </Label>
                        <Label class="text-sm text-muted-foreground" v-if="message.created_at">{{ new
                            Date(message.created_at).toLocaleString() }}</Label>
                    </div>
                    <div>
                        {{ message.content }}
                    </div>
                </div>
            </div>

            <AssistantMessage v-if="message.role === 'assistant'" @messageRendered="scrollToBottom()"
                @downvoted="emits('downvoted', $event)" :message="message" :message_index="index">
            </AssistantMessage>

        </div>

        <div v-if="status?.startsWith('THINKING')" class="text-sm flex items-center gap-2">
            <Loader class="!size-3"></Loader>
            {{ status.split(':')[1] }} is thinking...
        </div>

        <div v-if="status?.startsWith('FUNCTION')" class="text-sm flex items-center gap-2">
            <Loader class="!size-3"></Loader>
            {{ status.split(':')[1] }} is calling a function...
        </div>

        <div v-if="status?.startsWith('FINDING_AGENT')" class="text-sm flex items-center gap-2">
            <Loader class="!size-3"></Loader>
            Finding best agents...
        </div>

        <div v-if="status?.startsWith('ERRORED')" class="flex items-center gap-2">
            <CircleAlert class="text-orange-300 size-4"></CircleAlert>
            <div v-if="messages && messages.length < 100"> An error occurred. Please use another chat. </div>
            <div v-else> Context limit reached </div>
        </div>



        <DevOnly>
            <div class="flex items-center gap-1 text-muted-foreground overflow-hidden">
                <Icon name="gg:debug" size="20"></Icon>
                <div v-if="status"> {{ status }} </div>
                <div v-else> No Status </div>
            </div>
        </DevOnly>


    </div>
</template>