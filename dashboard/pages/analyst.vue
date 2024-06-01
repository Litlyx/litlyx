<script lang="ts" setup>
definePageMeta({ layout: 'dashboard' });


const activeProject = useActiveProject();

const { data: chatsList, refresh: reloadChatsList } = useFetch(`/api/ai/${activeProject.value?._id}/chats_list`, signHeaders());

const { data: chatsRemaining, refresh: reloadChatsRemaining } = useFetch(`/api/ai/${activeProject.value?._id}/chats_remaining`, signHeaders());

const currentText = ref<string>("");
const loading = ref<boolean>(false);

const currentChatId = ref<string>("");
const currentChatMessages = ref<any[]>([]);

const scroller = ref<HTMLDivElement | null>(null);

async function sendMessage() {
    if (loading.value) return;
    if (!activeProject.value) return;
    loading.value = true;

    const body: any = { text: currentText.value }
    if (currentChatId.value) body.chat_id = currentChatId.value

    currentChatMessages.value.push({ role: 'user', content: currentText.value });

    setTimeout(() => scrollToBottom(), 1);
    currentText.value = '';


    try {

        const res = await $fetch(`/api/ai/${activeProject.value._id.toString()}/send_message`, {
            method: 'POST',
            body: JSON.stringify(body),
            ...signHeaders({ 'Content-Type': 'application/json' })
        });
        currentChatMessages.value.push({ role: 'assistant', content: res });

        await reloadChatsRemaining();
        await reloadChatsList();
        currentChatId.value = chatsList.value?.at(-1)?._id.toString() || '';


    } catch (ex: any) {
        if (ex.message.includes('CHAT_LIMIT_REACHED')) {
            currentChatMessages.value.push({
                role: 'assistant',
                content: 'You have reached your current tier chat limit.\n Upgrade to an higher tier. <a style="color: blue; text-decoration: underline;" href="/plans"> Upgrade now. </a>',
            });
        }
    }


    setTimeout(() => scrollToBottom(), 1);


    loading.value = false;


}

async function openChat(chat_id?: string) {
    if (!activeProject.value) return;
    if (!chat_id) {
        currentChatMessages.value = [];
        currentChatId.value = '';
        return;
    }
    currentChatId.value = chat_id;
    const messages = await $fetch(`/api/ai/${activeProject.value._id}/${chat_id}/get_messages`, signHeaders());
    if (!messages) return;
    currentChatMessages.value = messages;
    setTimeout(() => scrollToBottom(), 1);

}

function scrollToBottom() {
    if (!scroller.value) return;
    scroller.value.scrollTo({ behavior: 'smooth', top: 999999 })
}


function parseMessageContent(content: string) {
    return content.replace(/\*\*(.*?)\*\*/g, '<b class="text-text">$1</b>');
}

</script>

<template>
    <div class="w-full h-full">

        <div class="flex flex-row-reverse h-full">

            <div class="flex-[2] bg-[#303030] p-6 flex flex-col gap-4">

                <div class="gap-2 flex flex-col">
                    <div class="poppins font-semibold text-[1.5rem]">
                        Lit, your AI Analyst is here!
                    </div>
                    <div class="poppins text-text/75">
                        Ask anything you want on your analytics,
                        and understand more Trends and Key Points to take Strategic moves!
                    </div>
                </div>

                <div class="flex gap-2 items-center py-3">
                    <div class="bg-accent w-5 h-5 rounded-full animate-pulse">
                    </div>
                    <div class="manrope font-semibold"> {{ chatsRemaining }} remaining messages </div>
                </div>

                <div>
                    <div class="poppins font-semibold text-[1.1rem]"> History: </div>

                    <div class="flex flex-col w-full mt-4 gap-2">

                        <div @click="openChat()"
                            class="bg-menu px-4 py-3 cursor-pointer hover:bg-menu/80 poppins rounded-lg mb-8 flex gap-2 items-center">
                            <div> <i class="fas fa-plus"></i> </div>
                            <div> New chat </div>
                        </div>

                        <div @click="openChat(chat._id.toString())" v-for="chat of chatsList"
                            class="bg-menu px-4 py-3 cursor-pointer hover:bg-menu/80 poppins rounded-lg"
                            :class="{ '!bg-accent/60': chat._id.toString() === currentChatId }">
                            {{ chat.title }}
                        </div>
                    </div>

                </div>


            </div>

            <div class="flex-[5] py-8 flex flex-col items-center relative">

                <div class="flex flex-col items-center mt-[20vh] px-28" v-if="currentChatMessages.length == 0">
                    <div class="w-[10rem]">
                        <img :src="'analyst.png'" class="w-full h-full">
                    </div>
                    <div class="poppins text-[1.2rem]">
                        How can i help you today?
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-6">
                        <div class="bg-[#2f2f2f] p-4 rounded-lg poppins">
                            How many visits i got last week ?
                        </div>
                        <div class="bg-[#2f2f2f] p-4 rounded-lg poppins">
                            How many visits i got last week ?
                        </div>
                        <div class="bg-[#2f2f2f] p-4 rounded-lg poppins">
                            How many visits i got last week ?
                        </div>
                        <div class="bg-[#2f2f2f] p-4 rounded-lg poppins">
                            How many visits i got last week ?
                        </div>
                    </div>
                </div>

                <div ref="scroller" class="flex flex-col w-full gap-6 px-28 overflow-y-auto pb-20">

                    <div class="flex w-full" v-for="message of currentChatMessages">
                        <div class="flex justify-end w-full poppins text-[1.1rem]" v-if="message.role === 'user'">
                            <div class="bg-[#303030] px-5 py-3 rounded-lg">
                                {{ message.content }}
                            </div>
                        </div>
                        <div class="flex items-center gap-3 justify-start w-full poppins text-[1.1rem]"
                            v-if="message.role === 'assistant'">
                            <div class="flex items-center justify-center shrink-0">
                                <img class="h-[3.5rem] w-auto" :src="'analyst.png'">
                            </div>
                            <div v-html="parseMessageContent(message.content)"
                                class="max-w-[70%] text-text/90 whitespace-pre-wrap">
                            </div>
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



                <div class="flex gap-2 items-center absolute bottom-8 left-0 w-full px-28">
                    <input v-model="currentText" class="bg-[#303030] w-full focus:outline-none px-4 py-2 rounded-lg"
                        type="text">
                    <div @click="sendMessage()"
                        class="bg-[#303030] hover:bg-[#464646] cursor-pointer px-4 py-2 rounded-full">
                        <i class="far fa-arrow-up"></i>
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>