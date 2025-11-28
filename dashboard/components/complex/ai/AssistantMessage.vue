<script lang="ts" setup>
import type { MDCNode, MDCParserResult, MDCRoot } from '@nuxtjs/mdc';
import { InfoIcon, ThumbsDown, ThumbsUp } from 'lucide-vue-next';
import type { ReadableChatMessage } from '~/pages/ai.vue';
import AiChart from '~/components/complex/ai/Chart.vue'

const props = defineProps<{ message: ReadableChatMessage, message_index: number }>();

const parsedMessage = ref<MDCParserResult>();

const hidden = ref<boolean>(props.message.downvoted ?? false);

const emits = defineEmits<{
    (event: 'messageRendered'): void;
    (event: 'downvoted', index: number): void;
}>();


function removeEmbedImages(data: MDCRoot | MDCNode) {
    if (data.type !== 'root' && data.type !== 'element') return;
    if (!data.children) return;
    const imgChilds = data.children.filter(e => e.type === 'element' && e.tag === 'img');
    if (imgChilds.length == 0) return data.children.forEach(e => removeEmbedImages(e));
    for (let i = 0; i < imgChilds.length; i++) {
        const index = data.children.indexOf(imgChilds[i]);
        console.log('Index', index)
        if (index == -1) continue;
        data.children.splice(index, 1);
    }
    return data.children.forEach(e => removeEmbedImages(e));
}

onMounted(async () => {
    if (!props.message.content) return;
    const parsed = await parseMarkdown(props.message.content);
    await new Promise(e => setTimeout(e, 200));
    parsedMessage.value = parsed;
    removeEmbedImages(parsed.body);
    emits('messageRendered');
})

const AI_MAP: Record<string, { img: string, color: string }> = {
    GrowthAgent: { img: '/ai/growth.png', color: '#ff861755' },
    MarketingAgent: { img: '/ai/marketing.png', color: '#bf7fff55' },
    ProductAgent: { img: '/ai/product.png', color: '#00f33955' },
}

const messageStyle = computed(() => {
    if (!props.message.name) return;
    const target = AI_MAP[props.message.name];
    if (!target) return '';
    return `background-color: ${target.color};`
});

const isContentMessage = computed(() => !props.message.tool_calls && props.message.content && !hidden.value);
const isHiddenMessage = computed(() => !props.message.tool_calls && props.message.content && hidden.value);
const isToolMessage = computed(() => props.message.tool_calls);

function downvoteMessage() {
    emits('downvoted', props.message_index)
    hidden.value = true;
}

</script>
<template>

    <div class="w-full flex justify-start ml-4">


        <div v-if="isToolMessage" class="flex flex-col w-[70%] gap-3">
            <div class="flex flex-col gap-2 flex-end">

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger class="w-fit">
                            <div class="flex gap-1 items-center text-sm w-fit">
                                <InfoIcon class="size-4"></InfoIcon>
                                <div> The ai will use some functions </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div class="font-semibold" v-for="tool of message.tool_calls">
                                {{ tool.function.name }}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

            <div v-if="isToolMessage && message.tool_calls?.[0].function.name === 'createChart'"
                class="flex flex-col gap-2 flex-end">
                <AiChart :data="JSON.parse(message.tool_calls[0].function.arguments)"></AiChart>
            </div>
        </div>




        <div v-if="isContentMessage" :style="messageStyle"
            class="border rounded-md p-2 flex flex-col gap-2 flex-end w-[70%] relative agent-message-with-content  border-accent-foreground/20">

            <div class="absolute left-[-1rem] top-[-1rem] rotate-[-15deg]">
                <img v-if="message.name && AI_MAP[message.name]" class="h-[3rem]" :src="AI_MAP[message.name].img">
            </div>

            <div class="flex gap-2 items-center">
                <img class="w-5 h-auto" :src="'/ai/pixel-boy.png'">
                <Label> {{ message.name ?? 'AI' }} </Label>
                <Label class="text-sm text-muted-foreground" v-if="message.created_at">
                    {{ new Date(message.created_at).toLocaleString() }}
                </Label>
            </div>

            <MDCRenderer class="md-content !text-gray-800 dark:!text-white" v-if="parsedMessage" :body="parsedMessage.body"
                :data="parsedMessage.data" />
            <Skeleton v-if="!parsedMessage" class="w-full h-[5rem]"></Skeleton>
        </div>

        <div v-if="isHiddenMessage" :style="messageStyle"
            class="border rounded-md p-2 flex flex-col gap-2 flex-end w-[70%] relative">
            <div class="absolute left-[-1rem] top-[-1rem] rotate-[-15deg]">
                <img v-if="message.name && AI_MAP[message.name]" class="h-[3rem]" :src="AI_MAP[message.name].img">
            </div>
            <div class="flex gap-2 items-center ml-6">
                <Label> {{ message.name ?? 'AI' }} </Label>
                <Label class="text-sm text-muted-foreground" v-if="message.created_at">
                    {{ new Date(message.created_at).toLocaleString() }}
                </Label>
            </div>

            <div>
                Message deleted becouse downvoted
            </div>
        </div>

        <div v-if="isContentMessage" class="flex ml-2 items-end gap-2">
            <ThumbsDown @click="downvoteMessage()" :class="{ 'text-red-400': message.downvoted }" class="size-4">
            </ThumbsDown>
        </div>

    </div>

</template>

<style lang="scss" scoped>
.agent-message-with-content .md-content {

    &:deep() {
        font-family: system-ui, sans-serif;
        line-height: 1.5;
        color: white;
        font-size: 1rem;

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-weight: 700;
            line-height: 1.25;
            margin: 2rem 0 1rem;
            scroll-margin-top: 100px;
        }


        h1 {
            font-size: 2rem;
            border-bottom: 1px solid #ddd;
            padding-bottom: 0.3rem;
        }

        h2 {
            font-size: 1.5rem;
        }

        h3 {
            font-size: 1.25rem;
        }

        h4 {
            font-size: 1.125rem;
        }

        h5 {
            font-size: 1rem;
        }

        h6 {
            font-size: 0.875rem;
        }

        // Paragraphs
        p {
            margin: 1rem 0;
        }

        // Links
        a {
            cursor: default;
            pointer-events: none;
        }

        // Lists
        ul,
        ol {
            padding-left: 1.5rem;
            margin: 1rem 0;

            li {
                margin: 0.5rem 0;
            }
        }

        // Blockquote
        blockquote {
            margin: 1.5rem 0;
            padding: 1rem 1.5rem;
            border-left: 4px solid #ccc;
            background-color: #f9f9f9;
            color: #555;
            font-style: italic;
        }

        // Code blocks
        pre {
            background: #1e1e1e;
            color: #dcdcdc;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
            margin: 1.5rem 0;
        }

        code {
            background: #f3f3f3;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
        }

        pre code {
            background: none;
            padding: 0;
        }

        // Tables
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.95rem;

            th,
            td {
                padding: 0.75rem;
                text-align: left;
            }

            th {
                background-color: #0000006c;
            }

            tr:nth-child(even) {
                background-color: #ffffff23;
            }
        }

        // Images
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1rem 0;
            border-radius: 8px;
        }

        // Horizontal rule
        hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 2rem 0;
        }

    }

}
</style>