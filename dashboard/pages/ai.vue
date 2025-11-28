<script lang="ts" setup>
import { DialogDangerGeneric } from '#components';
import { SendHorizonal, MessageSquareText } from 'lucide-vue-next';
import ChatsList from '~/components/complex/ai/ChatsList.vue';
import AiChat from '~/components/complex/ai/AiChat.vue';
import type { TAiNewChatSchema } from '~/shared/schema/ai/AiNewChatSchema';
import EmptyAiChat from '~/components/complex/ai/EmptyAiChat.vue';


export type ReadableChatMessage = {
    role: string,
    content: string,
    name?: string,
    tool_calls?: { id: string, function: { name: string, arguments: string } }[],
    created_at?: string,
    downvoted?: boolean
}

export type ReadableChat = {
    title: string,
    project_id: string,
    status: string,
    created_at: string,
    messages: ReadableChatMessage[],
    updated_at: string
}

definePageMeta({ layout: 'sidebar' });

const { data: chats, refresh: refreshChats } = useAuthFetch<TAiNewChatSchema[]>('/api/ai/list');
const { permissions } = useProjectStore();
const premium = usePremiumStore();

const currentChatId = ref<string>('');
const currentChat = ref<ReadableChat>();

const message = ref<string>('');


const sheetOpen = ref<boolean>(false);

async function getCurrentChatData() {
    if (currentChatId.value === 'null' || currentChatId.value.length == 0) {
        currentChat.value = undefined;
        return;
    }

    const res = await useAuthFetchSync<TAiNewChatSchema>(`/api/ai/chat?id=${currentChatId.value}`)
    const data = createReadableChat(res);
    currentChat.value = data;
}

function selectChat(chat_id: string) {
    currentChatId.value = chat_id;
    sheetOpen.value = false;
    getCurrentChatData();
    pollChat();
}


const canAskAi = computed(() => {
    if (message.value.trim().length == 0) return false;
    if (!currentChatId.value) return true;
    if (!currentChat.value?.status) return false;
    if (!isFinished(currentChat.value.status)) return false;
    return true;
})

let pollingInterval: any | undefined;

function isFinished(status: string) {
    return status.startsWith('COMPLETED') || status.startsWith('ERRORED');
}

function pollChat() {
    if (currentChat.value && !isFinished(currentChat.value.status)) {
        pollingInterval = setInterval(async () => {
            await getCurrentChatData();
            if (currentChat.value && isFinished(currentChat.value.status)) {
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    pollingInterval = undefined;
                }
            }
        }, 2000)
    }
}

function createReadableChat(schema: TAiNewChatSchema) {

    const result: ReadableChat = {
        title: schema.title,
        project_id: schema.project_id.toString(),
        status: schema.status,
        created_at: schema.created_at.toString(),
        updated_at: schema.updated_at.toString(),
        messages: []
    };

    for (let i = 0; i < schema.messages.length; i++) {
        const message = schema.messages[i];

        const resultMessage: ReadableChatMessage = {
            content: message.content,
            role: message.role,
            name: message.name,
            tool_calls: message.tool_calls,
            created_at: message.created_at,
            downvoted: message.downvoted ?? false
        };

        result.messages.push(resultMessage);
    }



    return result;

}

async function downvoteMessage(message_index: number) {
    await useAuthFetchSync(`/api/ai/downvote_message?chat_id=${currentChatId.value}&message_index=${message_index}`, {
        method: 'POST'
    });
}

async function askAi() {

    const currentMessage = message.value;

    if (currentMessage.trim().length == 0) return;

    message.value = '';

    const { chat_id } = await useAuthFetchSync(`/api/ai/ask?chat_id=${currentChatId.value}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { message: currentMessage }
    });

    currentChatId.value = chat_id;

    await getCurrentChatData();
    await refreshChats();

    setTimeout(async () => {
        await getCurrentChatData();
        pollChat();
    }, 1000)


}

function onKeyPress(e: any) {
    if (e.key === 'Enter') askAi();
}

const { open } = useDialog();

async function deleteChat(chat_id: string) {
    await open({
        body: DialogDangerGeneric,
        title: 'Deleting chat',
        props: {
            label: 'Are you sure to delete the chat?'
        },
        async onSuccess(data, close) {
            await useCatch({
                toast: true,
                toastTitle: 'Error deleting chat',
                async action() {
                    return await useAuthFetchSync(`/api/ai/delete_chat?chat_id=${chat_id}`)
                },
                onSuccess(data, showToast) {
                    showToast('Chat deleted', {});
                    refreshChats();
                    selectChat('null');
                    close();
                },
            })
        },
    })
}


async function deleteAllChats() {
    await open({
        body: DialogDangerGeneric,
        title: 'Deleting all chat',
        props: {
            label: 'Are you sure to delete all the chats?'
        },
        async onSuccess(data, close) {
            await useCatch({
                toast: true,
                toastTitle: 'Error deleting chats',
                async action() {
                    return await useAuthFetchSync(`/api/ai/delete_all_chats`)
                },
                onSuccess(data, showToast) {
                    showToast('Chats deleted', {});
                    refreshChats();
                    selectChat('null');
                    close();
                },
            })
        },
    })
}

function handleSend(p: string) {
    message.value = p;
    askAi()
}

</script>

<template>

    <Unauthorized v-if="permissions?.ai === false || [0].includes(premium.planInfo?.ID ?? -1)"
        authorization="PLAN or AUTH">
    </Unauthorized>

    <div v-else class="h-full flex flex-col gap-2 poppins">
        
        <AiChat class="grow" :messages="currentChat?.messages" :status="currentChat?.status"
            @downvoted="downvoteMessage($event)">
        </AiChat>

        <EmptyAiChat v-if="!currentChat?.status" @sendprompt="handleSend" @open-sheet="sheetOpen = true" />

        <div>
            <div class="flex items-center gap-4 shrink-0" :class="currentChat?.status ? '' : 'flex justify-end'">
                <Button v-if="currentChat?.status" :disabled="!canAskAi"
                    class="absolute bottom-6 right-22 size-8 rounded" @click="askAi()">
                    <SendHorizonal class="size-4" />
                </Button>
                <Input v-if="currentChat?.status" @keypress="onKeyPress" v-model="message" placeholder="Message"
                    class="h-12 text-lg pr-12 bg-white dark:bg-black" />
                <Sheet v-model:open="sheetOpen">
                    <SheetTrigger as-child>
                        <Button v-if="currentChat?.status" class="size-12" variant="outline">
                            <MessageSquareText />
                        </Button>
                    </SheetTrigger>
                    <SheetContent class="overflow-hidden">
                        <SheetHeader>
                            <SheetTitle> Chats </SheetTitle>
                            <SheetDescription>
                                Assistant chats history
                            </SheetDescription>
                        </SheetHeader>
                        <div class="p-4 h-full" v-if="chats">
                            <ChatsList @delete-all-chats="deleteAllChats()" @deleteChat="deleteChat($event)"
                                @selectChat="selectChat" :chats="chats"></ChatsList>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>

    </div>

</template>