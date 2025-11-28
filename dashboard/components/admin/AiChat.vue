<script lang="ts" setup>
import { TrashIcon } from 'lucide-vue-next';
import type { TAiNewChatSchema } from '~/shared/schema/ai/AiNewChatSchema';

const { data: chats } = useAuthFetch<TAiNewChatSchema[]>('/api/admin/aichats');

</script>

<template>
    <div class="flex flex-col gap-4 h-full overflow-y-auto">
        <Card v-for="chat of chats.toReversed()">
            <CardHeader>
                <div class="flex gap-4 justify-center text-muted-foreground">
                    <div class="font-semibold text-white"> {{ chat.title }} </div>
                    <div> {{ chat.status }} </div>
                    <div> {{ new Date(chat.created_at).toLocaleString('it-IT') }} </div>
                </div>
            </CardHeader>
            <CardContent>
                <div class="flex flex-col gap-4">
                    <div v-for="e of chat.messages">
                        <div class="flex gap-2 items-center" v-if="e.role === 'user'">
                            <div class="text-white/40 shrink-0">
                                {{ new Date(chat.created_at).toLocaleString('it-IT') }}
                            </div>
                            <div> {{ e.name }}: </div>
                            <div> {{ e.content }} </div>
                        </div>
                        <div class="flex gap-2 items-center"
                            v-else-if="e.role === 'assistant' && e.tool_calls && e.tool_calls.length > 0">
                            <div class="text-white/40 shrink-0">
                                {{ new Date(chat.created_at).toLocaleString('it-IT') }}
                            </div>
                            <div> {{ e.name }}: </div>
                            <div> Function call <span class="font-semibold">{{e.tool_calls.map((e: any) =>
                                e.function.name).join(' ') }} </span></div>
                        </div>
                        <div class="flex gap-2 items-center" v-else-if="e.role === 'assistant' && !e.tool_calls">
                            <div class="text-white/40 shrink-0">
                                {{ new Date(chat.created_at).toLocaleString('it-IT') }}
                            </div>
                            <div> {{ e.name }}: </div>
                            <div> {{ e.content }} </div>
                        </div>
                        <div class="flex gap-2 items-center" v-else-if="e.role === 'tool'">
                             <div class="text-white/40 shrink-0">
                                {{ new Date(chat.created_at).toLocaleString('it-IT') }}
                            </div>
                            <div> TOOL CALL </div>
                        </div>
                        <div v-else>
                            {{ e.role }}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

    </div>
</template>