<script lang="ts" setup>
import { AlertCircle, TrashIcon } from 'lucide-vue-next';
import type { TAiNewChatSchema } from '~/shared/schema/ai/AiNewChatSchema';

const props = defineProps<{ chats: TAiNewChatSchema[] }>();

const emits = defineEmits<{
    (event: 'selectChat', chat_id: string): void;
    (event: 'deleteAllChats'): void;
    (event: 'deleteChat', chat_id: string): void;
}>();

const separatorIndex = props.chats.toReversed().findIndex(e => new Date(e.updated_at).getUTCDay() < new Date().getUTCDay());

</script>
<template>
    <div class="flex flex-col gap-4 overflow-hidden h-full">

        <div class="flex flex-col gap-2">
            <Button @click="emits('deleteAllChats')" size="sm" class="w-full" variant="destructive">
                Delete all
            </Button>

            <Button @click="emits('selectChat', 'null')" size="sm" class="w-full" variant="secondary">
                New chat
            </Button>
        </div>

        <div class="flex flex-col gap-2 overflow-y-auto h-full pr-2 pb-[10rem]">

            <div v-for="(chat, index) of chats.toReversed()">

                <div v-if="separatorIndex === index" class="flex flex-col items-center mt-2 mb-2">
                    <Label class="text-muted-foreground"> Older chats </Label>
                </div>

                <div class="flex items-center gap-2 rounded-md border p-2">
                    <TooltipProvider>
                        <Tooltip :delay-duration="700">
                            <TooltipTrigger class="grow cursor-pointer flex gap-2 items-center"
                                @click="emits('selectChat', chat._id.toString())">
                                <AlertCircle v-if="chat.status === 'ERRORED'" class="size-4 shrink-0 text-orange-300">
                                </AlertCircle>
                                <div class="text-ellipsis line-clamp-1 text-left">
                                    {{ chat.title }}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                 {{ chat.status === 'ERRORED' ? '[ERROR]' : '' }} {{ chat.title }}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div class="shrink-0 cursor-pointer hover:text-red-400">
                        <TrashIcon @click="emits('deleteChat', chat._id.toString())" class="size-4"></TrashIcon>
                    </div>
                </div>
            </div>




        </div>
    </div>

</template>