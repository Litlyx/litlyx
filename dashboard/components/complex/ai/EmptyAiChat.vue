<script lang="ts" setup>
import { ArrowUp, Flame, List, MessageSquareText, TriangleAlert } from 'lucide-vue-next'

const emits = defineEmits<{
    (event: 'sendprompt', message: string): void;
    (event: 'open-sheet'): void;
}>();

const prompts = [
    'What traffic sources brought the most visitors last week?',
    'Show me the user retention rate for the past month',
    "How many users visited the website yesterday?",
    "Did our traffic increase compared to last month?",
    "Which page had the most views yesterday?",
    "Did users spend more time on site this week than last?",
    "Are desktop users staying longer than mobile users?",
    "Did our top 5 countries change this month?",
    "How many users visited the website yesterday?",

]

const input = ref('')
const toggleSet = ref('')
function onKeyPress(e: any) {
    if (e.key === 'Enter') emits('sendprompt', input.value);
}

const checkInput = computed(() => input.value.trim().length > 0)


const handleSubmit = () => {
    if (!input.value.trim()) return
    console.log('Inviato:', input.value)
    input.value = ''
}

//Effetto macchina da scrivere desiderato da fratello antonio
const baseText = 'Ask me about... '
const placeholder_texts = ['your Month over Month growth in visits', 'your top traffic source last week', 'how long visitors stick around', 'how can I help you', 'to turn your visitor data into a bar chart']

const placeholder = ref('')

const typingSpeed = 35
const pauseAfterTyping = 800
const pauseAfterDeleting = 400

let index = 0
let charIndex = 0
let isDeleting = false
let typingTimeout: ReturnType<typeof setTimeout> | null = null

function startTyping() {
    const current = placeholder_texts[index]

    placeholder.value = baseText + current.substring(0, charIndex)

    if (!isDeleting) {
        if (charIndex < current.length) {
            charIndex++
            typingTimeout = setTimeout(startTyping, typingSpeed)
        } else {
            typingTimeout = setTimeout(() => {
                isDeleting = true
                startTyping()
            }, pauseAfterTyping)
        }
    } else {
        if (charIndex > 0) {
            charIndex--
            typingTimeout = setTimeout(startTyping, typingSpeed)
        } else {
            isDeleting = false
            index = (index + 1) % placeholder_texts.length
            typingTimeout = setTimeout(startTyping, pauseAfterDeleting)
        }
    }
}

function resetTyping() {
    if (typingTimeout) clearTimeout(typingTimeout)
    index = 0
    charIndex = 0
    isDeleting = false
    startTyping()
}

onMounted(() => {
    startTyping()
})

watch(input, (newValue) => {
    if (newValue === '') {
        resetTyping()
    }
})
</script>

<template>
    <div class="h-dvh flex items-center justify-center poppins">
        <div class="w-full max-w-2xl space-y-4">
            <div class="flex flex-col items-center">
                <div class="text-center mb-4">
                    <h1 class="text-2xl font-medium dark:text-white text-violet-500 tracking-tight">
                        AI Assistant
                    </h1>
                    <p class="text-sm  text-gray-400 dark:text-zinc-400 mt-1">
                        A dedicated team of smart AI experts on Marketing, Growth and Product.
                    </p>
                </div>
                <!-- <Alert class="border-yellow-500">
                  <TriangleAlert class="size-4 !text-yellow-500"/>
    <AlertTitle>Our AI is still in development… we know it’s scrappy.</AlertTitle>
    <AlertDescription>
      Using it helps us learn what you really need. Got feedback? We’d love to hear it!
    </AlertDescription>
  </Alert> -->
            </div>
            <!-- Input container -->
            <div class="relative bg-gray-200 dark:bg-zinc-800 rounded-2xl p-4 shadow-md flex flex-col gap-4">
                <div
                    class="absolute z-0 border-2 animate-pulse border-violet-500 w-full h-full top-0 left-0 rounded-[14px]">
                </div>

                <div class="w-full relative z-10">
                    <Input v-model="input" :placeholder="placeholder"
                        class="pl-0 !bg-transparent !border-none shadow-none text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 !outline-none !ring-0"
                        @keypress="onKeyPress" />

                </div>
                <div class="flex justify-between items-center gap-2 relative z-10">
                    <ToggleGroup type="single" variant="outline" v-model="toggleSet">

                        <ToggleGroupItem value="prompts" aria-label="Toggle italic">
                            <span class="text-sm font-normal items-center flex gap-2">
                                <List class="size-4" /> Prompts
                            </span>
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <div class="flex gap-2">
                        <Button size="icon" @click="emits('open-sheet')" variant="ghost">
                            <MessageSquareText class="size-4" />
                        </Button>
                        <Button size="icon" @click="emits('sendprompt', input)" :disabled="!checkInput">
                            <ArrowUp class="size-4" />
                        </Button>
                    </div>

                </div>
            </div>

            <div class="overflow-hidden transition-all duration-300"
                :class="toggleSet === 'prompts' ? 'max-h-40 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'">
                <div class="rounded-md flex flex-col gap-2">
                    <Button v-for="p of prompts" variant="outline" @click="emits('sendprompt', p)" class="truncate">{{ p
                        }}</Button>
                    <!--                     <NuxtLink to="#">
                        <Button variant="link">View complete list</Button>
                    </NuxtLink> -->
                </div>
            </div>
        </div>
    </div>
</template>