<script lang="ts" setup>

import VueMarkdown from 'vue-markdown-render';

definePageMeta({ layout: 'dashboard' });


const debugModeAi = ref<boolean>(false);

const { userRoles } = useLoggedUser();

const { project } = useProject();

const { data: chatsList, refresh: reloadChatsList } = useFetch(`/api/ai/chats_list`, {
    headers: useComputedHeaders({ useSnapshotDates: false })
});

const viewChatsList = computed(() => (chatsList.value || []).toReversed());

const { data: chatsRemaining, refresh: reloadChatsRemaining } = useFetch(`/api/ai/chats_remaining`, {
    headers: useComputedHeaders({ useSnapshotDates: false })
});

const currentText = ref<string>("");
const loading = ref<boolean>(false);
const canSend = ref<boolean>(true);

const currentChatId = ref<string>("");
const currentChatMessages = ref<{ role: string, content: string, charts?: any[], tool_calls?: any }[]>([]);
const currentChatMessageDelta = ref<string>("");


const typer = useTextType({ ms: 10, increase: 2 }, () => {
    const cleanMessage = currentChatMessageDelta.value.replace(/\[(data:(.*?))\]/g, '');
    if (typer.index.value >= cleanMessage.length) typer.pause();
});

onUnmounted(() => {
    typer.stop();
})

const currentChatMessageDeltaTextVisible = computed(() => {
    const cleanMessage = currentChatMessageDelta.value.replace(/\[(data:(.*?))\]/g, '');
    const textVisible = cleanMessage.substring(0, typer.index.value);
    setTimeout(() => scrollToBottom(), 1);
    return textVisible;
});

const currentChatMessageDeltaShowLoader = computed(() => {
    const lastData = currentChatMessageDelta.value.match(/\[(data:(.*?))\]$/);
    return lastData != null;
});

const scroller = ref<HTMLDivElement | null>(null);


async function pollSendMessageStatus(chat_id: string, times: number, updateStatus: (status: string) => any) {

    if (times > 100) return;

    const res = await $fetch(`/api/ai/${chat_id}/status`, {
        headers: useComputedHeaders({
            useSnapshotDates: false,
        }).value
    });
    if (!res) throw Error('Error during status request');

    updateStatus(res.status);


    typer.resume();


    if (res.completed === false) {
        setTimeout(() => pollSendMessageStatus(chat_id, times + 1, updateStatus), (times > 10 ? 2000 : 1000));
    } else {

        canSend.value = true;

        typer.stop();

        const messages = await $fetch(`/api/ai/${chat_id}/get_messages`, {
            headers: useComputedHeaders({ useSnapshotDates: false }).value
        });
        if (!messages) return;

        currentChatMessages.value = messages.map(e => ({ ...e, charts: e.charts.map(k => JSON.parse(k)) })) as any;
        currentChatMessageDelta.value = '';

    }

}

async function sendMessage() {

    if (canSend.value === false) return;

    if (loading.value) return;
    if (!project.value) return;

    if (currentText.value.length == 0) return;

    loading.value = true;

    const body: any = { text: currentText.value, timeOffset: new Date().getTimezoneOffset() }
    if (currentChatId.value) body.chat_id = currentChatId.value

    currentChatMessages.value.push({ role: 'user', content: currentText.value });

    setTimeout(() => scrollToBottom(), 1);
    currentText.value = '';


    try {

        canSend.value = false;

        const res = await $fetch<{ chat_id: string }>(`/api/ai/send_message`, { method: 'POST', body: JSON.stringify(body), headers: useComputedHeaders({ useSnapshotDates: false, custom: { 'Content-Type': 'application/json' } }).value });
        currentChatId.value = res.chat_id;

        await reloadChatsRemaining();
        await reloadChatsList();

        await new Promise(e => setTimeout(e, 200));


        typer.start();

        await pollSendMessageStatus(res.chat_id, 0, status => {
            if (!status) return;
            if (status.length > 0) loading.value = false;
            currentChatMessageDelta.value = status;
        });



    } catch (ex: any) {

        if (ex.message.includes('CHAT_LIMIT_REACHED')) {
            currentChatMessages.value.push({
                role: 'assistant',
                content: `Chat limit reached.
                Upgrade your plan to continue chatting.`
            });
        } else if (ex.message.includes('Unauthorized')) {
            currentChatMessages.value.push({
                role: 'assistant',
                content: 'To use AI you need to provide AI_ORG, AI_PROJECT and AI_KEY in docker compose',
            });
        } else {
            currentChatMessages.value.push({ role: 'assistant', content: ex.message, });
        }
        loading.value = false;

        canSend.value = true;

    }


    setTimeout(() => scrollToBottom(), 1);

}

async function openChat(chat_id?: string) {
    menuOpen.value = false;
    if (!project.value) return;

    typer.stop();

    canSend.value = true;
    currentChatMessages.value = [];
    currentChatMessageDelta.value = '';

    if (!chat_id) {
        currentChatId.value = '';
        return;
    }
    currentChatId.value = chat_id;
    const messages = await $fetch(`/api/ai/${chat_id}/get_messages`, {
        headers: useComputedHeaders({ useSnapshotDates: false }).value
    });
    if (!messages) return;

    currentChatMessages.value = messages.map(e => ({ ...e, charts: e.charts.map(k => JSON.parse(k)) })) as any;
    setTimeout(() => scrollToBottom(), 1);

}

function scrollToBottom() {
    if (!scroller.value) return;
    scroller.value.scrollTo({ behavior: 'smooth', top: 999999 })
}


function parseMessageContent(content: string) {
    return content.replace(/\*\*(.*?)\*\*/g, '<b class="text-text">$1</b>');
}

function onKeyDown(e: KeyboardEvent) {
    if (e.code !== 'Enter') return;
    if (e.shiftKey === true) return;
    sendMessage();
}

const menuOpen = ref<boolean>(false);

const defaultPrompts = [
    "What can you do and how can you help me ?",
    "Show me an example line chart with random data",
    "How many visits did I get last week?",
    "Create a line chart of last week's visits"
]

async function deleteChat(chat_id: string) {
    if (!project.value) return;
    const sure = confirm("Are you sure to delete the chat ?");
    if (!sure) return;
    if (currentChatId.value === chat_id) {
        currentChatId.value = "";
        currentChatMessages.value = [];
        currentChatMessageDelta.value = '';
    }
    await $fetch(`/api/ai/${chat_id}/delete`, {
        headers: useComputedHeaders({ useSnapshotDates: false }).value
    });
    await reloadChatsList();
}

const { showDrawer } = useDrawer();


async function clearAllChats() {
    const sure = confirm(`Are you sure to delete all ${(chatsList.value?.length || 0)} chats ?`);
    if (!sure) return;
    await $fetch(`/api/ai/delete_all_chats`, {
        headers: useComputedHeaders({ useSnapshotDates: false }).value
    });
    await reloadChatsList();

    menuOpen.value = false;
    typer.stop();
    canSend.value = true;
    currentChatMessages.value = [];
    currentChatMessageDelta.value = '';
    currentChatId.value = '';


}


</script>

<template>
    <div class="w-full h-full overflow-y-hidden">

        <div class="flex flex-row h-full overflow-y-hidden">

            <div class="flex-[5] py-8 flex h-full flex-col items-center relative overflow-y-hidden">


                <div class="flex flex-col items-center xl:mt-[20vh] px-8 xl:px-28"
                    v-if="currentChatMessages.length == 0">
                    <div class="w-[7rem] xl:w-[10rem]">
                        <img :src="'analyst.png'" class="w-full h-full">
                    </div>
                    <div class="poppins text-[1.2rem] text-center">
                        Ask me anything about your data
                    </div>
                    <div class="flex flex-col xl:grid xl:grid-cols-2 gap-4 mt-6">
                        <div v-for="prompt of defaultPrompts" @click="currentText = prompt"
                            class="
                            bg-lyx-lightmode-widget-light dark:bg-lyx-widget-light hover:bg-lyx-lightmode-widget dark:hover:bg-lyx-widget outline-[1px] outline outline-lyx-lightmode-widget dark:outline-none
                            cursor-pointer p-4 rounded-lg poppins text-center whitespace-pre-wrap flex items-center justify-center text-[.9rem]">
                            {{ prompt }}
                        </div>
                    </div>
                </div>


                <div ref="scroller" class="flex flex-col w-full gap-6 px-6 xl:px-28 overflow-y-auto pb-20">

                    <div class="flex w-full flex-col" v-for="(message, messageIndex) of currentChatMessages">

                        <div v-if="message.role === 'user'" class="flex justify-end w-full poppins text-[1.1rem]">
                            <div class="bg-lyx-lightmode-widget dark:bg-lyx-widget-light px-5 py-3 rounded-lg">
                                {{ message.content }}
                            </div>
                        </div>

                        <div v-if="message.role === 'assistant' && (debugModeAi ? true : message.content)"
                            class="flex items-center gap-3 justify-start w-full poppins text-[1.1rem]">
                            <div class="flex items-center justify-center shrink-0">
                                <img class="h-[3.5rem] w-auto" :src="'analyst.png'">
                            </div>
                            <div class="max-w-[70%] text-lyx-lightmode-text dark:text-text/90 ai-message">

                                <vue-markdown v-if="message.content" :source="message.content" :options="{
                                    html: true,
                                    breaks: true,
                                }" />


                                <div v-if="debugModeAi && !message.content">
                                    <div class="flex flex-col"
                                        v-if="message.tool_calls && message.tool_calls.length > 0">
                                        <div> {{ message.tool_calls[0].function.name }}</div>
                                        <div> {{ message.tool_calls[0].function.arguments }} </div>
                                    </div>
                                </div>

                                <div v-if="debugModeAi && !message.content"
                                    class="text-[.8rem] flex gap-1 items-center w-fit hover:text-[#CCCCCC] cursor-pointer">
                                    <i class="fas fa-info text-[.7rem]"></i>
                                    <div class="mt-1">Debug</div>
                                </div>
                            </div>
                        </div>


                        <div v-if="message.charts && message.charts.length > 0"
                            class="flex items-center gap-3 justify-start w-full poppins text-[1.1rem] flex-col mt-4">
                            <div v-for="chart of message.charts" class="w-full">
                                <AnalystComposableChart :datasets="chart.datasets" :labels="chart.labels"
                                    :title="chart.title">
                                </AnalystComposableChart>
                            </div>
                        </div>

                    </div>



                    <div class="flex items-center gap-3 justify-start w-full poppins text-[1.1rem]"
                        v-if="currentChatMessageDelta">

                        <div class="flex items-center justify-center shrink-0">
                            <img class="h-[3.5rem] w-auto" :src="'analyst.png'">
                        </div>

                        <div class="max-w-[70%] text-text/90 ai-message">
                            <div v-if="currentChatMessageDeltaShowLoader" class="flex items-center gap-1">
                                <i class="fas fa-loader animate-spin"></i>
                                <div> Loading </div>
                            </div>
                            <vue-markdown :source="currentChatMessageDeltaTextVisible" :options="{
                                html: true,
                                breaks: true,
                            }" />
                        </div>

                    </div>





                    <div v-if="loading"
                        class="flex items-center mt-10 gap-3 justify-center w-full poppins text-[1.1rem]">
                        <div class="flex items-center justify-center">
                            <img class="animate-bounce h-[3.5rem] w-auto" :src="'analyst.png'">
                        </div>
                        <div class="poppins "> Loading </div>
                    </div>

                </div>

                <div class="flex gap-2 items-center md:absolute fixed bottom-8 left-0 w-full px-10 xl:px-28">
                    <input @keydown="onKeyDown" v-model="currentText"
                        class="bg-lyx-lightmode-widget-light dark:bg-lyx-widget-light w-full dark:focus:outline-none px-4 py-2 rounded-lg outline-[1px] outline outline-lyx-lightmode-widget dark:outline-none" type="text">
                    <div @click="sendMessage()"
                        class="bg-lyx-lightmode-widget-light hover:bg-lyx-lightmode-widget dark:bg-lyx-widget-light dark:hover:bg-lyx-widget-light cursor-pointer px-4 py-2 rounded-full">
                        <i class="far fa-arrow-up"></i>
                    </div>
                    <div @click="menuOpen = !menuOpen"
                        class="bg-lyx-widget-light xl:hidden hhover:bg-lyx-widget-light cursor-pointer px-4 py-2 rounded-full">
                        <i class="far fa-message"></i>
                    </div>
                </div>

            </div>


            <div :class="{
                'absolute top-0 left-0 w-full': menuOpen,
                'hidden xl:flex': !menuOpen
            }"
                class="flex-[2] bg-lyx-lightmode-background border-l-[1px] dark:bg-lyx-background-light p-6 flex flex-col gap-4 h-full overflow-hidden">

                <div class="gap-2 flex flex-col">
                    <div class="xl:hidden absolute right-6 top-2 text-[1.5rem]">
                        <i @click="menuOpen = false" class="fas fa-close cursor-pointer"></i>
                    </div>
                </div>

                <div :class="{ '!text-green-500': debugModeAi }" class="cursor-pointer text-red-500 w-fit"
                    v-if="userRoles.isAdmin.value" @click="debugModeAi = !debugModeAi"> Debug mode </div>

                <div class="flex justify-between items-center pt-3">
                    <div class="flex items-center gap-2">
                        <div class="bg-accent w-5 h-5 rounded-full animate-pulse">
                        </div>
                        <div class="manrope font-semibold text-lyx-lightmode-text dark:text-text-dirty"> {{
                            chatsRemaining }} remaining requests
                        </div>
                    </div>
                    <LyxUiButton type="primary" class="text-[.9rem] text-center " @click="showDrawer('PRICING')">
                        Upgrade
                    </LyxUiButton>
                </div>

                <div class="flex items-center gap-4">
                    <div class="poppins font-semibold text-[1.1rem]"> History </div>
                    <LyxUiButton v-if="chatsList && chatsList.length > 0" @click="clearAllChats()" type="secondary"
                        class="text-center text-[.8rem]">
                        Clear all
                    </LyxUiButton>
                </div>

                <div class="px-2">
                    <div @click="openChat()"
                        class="bg-lyx-lightmode-widget-light hover:bg-lyx-lightmode-widget dark:bg-lyx-widget-light cursor-pointer dark:hover:bg-lyx-widget rounded-lg px-4 py-3 poppins flex gap-4 items-center outline-[1px] outline outline-lyx-lightmode-widget dark:outline-none">
                        <div> <i class="fas fa-plus"></i> </div>
                        <div> New chat </div>
                    </div>
                </div>


                <div class="overflow-y-auto">
                    <div class="flex flex-col gap-2 px-2">
                        <div :class="{ '!bg-accent/60': chat._id.toString() === currentChatId }"
                            class="flex text-lyx-lightmode-text-dark dark:text-lyx-text-dark text-[.9rem] font-light rounded-lg items-center gap-4 w-full px-4 bg-lyx-lightmode-widget-light dark:bg-lyx-widget-light hover:bg-lyx-lightmode-widget dark:hover:bg-lyx-widget outline-[1px] outline outline-lyx-lightmode-widget dark:outline-none"
                            v-for="chat of viewChatsList">
                            <i @click="deleteChat(chat._id.toString())"
                                class="far fa-trash hover:text-gray-300 cursor-pointer"></i>
                            <div @click="openChat(chat._id.toString())"
                                class="py-3 w-full cursor-pointer poppins rounded-lg">
                                {{ chat.title }}
                            </div>
                        </div>

                    </div>
                </div>



            </div>

        </div>

    </div>
</template>

<style lang="scss">
.ai-message {

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-weight: bold;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
    }

    p:last-of-type {
        margin-bottom: 0;
    }

    p {
        line-height: 1.8;
        margin-bottom: 1em;
        max-width: 750px;
    }

    blockquote {
        margin: 1.5em 10px;
        padding: 10px 20px;
        color: #555;
        border-left: 5px solid #ccc;
        background-color: #f5f5f5;
    }

    pre {
        background-color: #f4f4f4;
        padding: 15px;
        border-radius: 5px;
        font-size: 14px;
        overflow-x: auto;
    }

    code {
        background-color: #f1f1f1;
        padding: 2px 5px;
        border-radius: 3px;
        font-size: 90%;
    }

    ul,
    ol {
        margin-left: 30px;
        margin-bottom: 1.5em;
    }

    li {
        margin-bottom: 0.5em;
    }

    a {
        color: #007acc;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    hr {
        border: 1px solid #ddd;
        margin: 2em 0;
    }

}
</style>