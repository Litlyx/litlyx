<script lang="ts" setup>

const { project } = useProject();
const { createAlert } = useAlert();

import 'highlight.js/styles/stackoverflow-dark.css';
import hljs from 'highlight.js';
import CardTitled from './CardTitled.vue';

import { Lit } from 'litlyx-js';

const props = defineProps<{
    firstInteraction: boolean,
    refreshInteraction: () => any
}>()

onMounted(() => {
    hljs.highlightAll();
})

function copyProjectId() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');
    navigator.clipboard.writeText(project.value?._id?.toString() || '');
    Lit.event('no_visit_copy_id');
    createAlert('Success', 'Project id copied successfully.', 'far fa-circle-check', 5000);
}


function copyScript() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');


    const createScriptText = () => {
        return [
            '<script defer ',
            `data-project="${project.value?._id}" `,
            'src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></',
            'script>'
        ].join('')
    }

    Lit.event('no_visit_copy_script');
    navigator.clipboard.writeText(createScriptText());
    createAlert('Success', 'Script copied successfully.', 'far fa-circle-check', 5000);
}


const scriptText = computed(() => {
    return [
        `<script defer data-project="${project.value?._id.toString()}"`,
        `\nsrc="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js">\n<`,
        `/script>`
    ].join('');
})


function reloadPage() {
    location.reload();
}

</script>

<template>

    <div v-if="!firstInteraction && project" class="mt-[5vh] flex flex-col">

        <div class="flex items-center justify-center">

            <div class="mr-4 animate-pulse w-[1rem] h-[1rem] bg-accent rounded-full"> </div>
            <div class="text-text/90 poppins text-[1.1rem] font-medium">
                Waiting for your first visit
            </div>
            <LyxUiButton class="ml-6" type="secondary" @click="reloadPage()">
                <div class="flex items-center gap-2">
                    <i class="far fa-refresh"></i>
                    <div> Refresh </div>
                </div>
            </LyxUiButton>
        </div>


        <div class="flex items-center justify-center mt-10">
            <div class="flex flex-col-reverse gap-6">

                <div class="flex gap-6 xl:flex-row flex-col">

                    <div class="h-full w-full">
                        <CardTitled class="h-full w-full xl:min-w-[500px] xl:h-[35rem]" title="Quick setup tutorial"
                            sub="Quickly Set Up Litlyx in 30 Seconds!">

                            <div class="flex items-center justify-center h-full w-full">

                                <iframe class="w-full h-full min-h-[400px]"
                                    src="https://www.youtube.com/embed/LInFoNLJ-CI?si=a97HVXpXFDgFg2Yp" title="Litlyx"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            </div>

                        </CardTitled>
                    </div>

                    <div class="flex flex-col gap-6">

                        <div class="w-full">
                            <CardTitled title="Quick Integration"
                                sub="Start tracking web analytics in one line. (works everywhere js is supported)">
                                <div class="flex flex-col items-end gap-4">
                                    <div class="w-full xl:text-[1rem] text-[.8rem]">
                                        <pre>
                                            <code class="language-html rounded-md">{{ scriptText }}</code>
                                        </pre>
                                    </div>
                                    <LyxUiButton type="secondary" @click="copyScript()">
                                        Copy
                                    </LyxUiButton>
                                </div>
                            </CardTitled>
                        </div>

                        <div class="h-full w-full">
                            <CardTitled class="h-full w-full" title="Project id"
                                sub="This is the identifier for this project, used to forward data">
                                <div class="flex items-center justify-between gap-4 mt-6">
                                    <div class="p-2 bg-[#1c1b1b] rounded-md w-full">
                                        <div class="w-full text-[.9rem] text-[#acacac]"> {{ project?._id }} </div>
                                    </div>
                                    <LyxUiButton type="secondary" @click="copyProjectId()"> Copy </LyxUiButton>
                                </div>

                            </CardTitled>
                        </div>

                    </div>
                </div>
                <div>
                    <div>
                        <CardTitled class="w-full h-full" title="Documentation"
                            sub="Learn how to use Litlyx in every tech stack">
                            <template #header>
                                <LyxUiButton @click="Lit.event('no_visit_goto_docs')" type="secondary"
                                    to="https://docs.litlyx.com">
                                    Visit documentation
                                </LyxUiButton>
                            </template>

                            <div class="flex flex-col items-end">
                                <div class="justify-center w-full hidden xl:flex gap-3">
                                    <a href="https://docs.litlyx.com/techs/js" target="_blank">
                                    <img class="cursor-pointer" :src="'tech-icons/js.png'" alt="Litlyx-Javascript-Analytics">
                                    </a>
                                    <a href="https://docs.litlyx.com/techs/nuxt" target="_blank">
                                    <img class="cursor-pointer" :src="'tech-icons/nuxt.png'" alt="Litlyx-Nuxt-Analytics">
                                    </a>
                                    <a href="https://docs.litlyx.com/techs/next" target="_blank">
                                    <img class="cursor-pointer" :src="'tech-icons/next.png'" alt="Litlyx-Next-Analytics">
                                    </a>
                                    <a href="https://docs.litlyx.com/techs/react" target="_blank">
                                    <img class="cursor-pointer" :src="'tech-icons/react.png'" alt="Litlyx-React-Analytics">
                                    </a>
                                    <a href="https://docs.litlyx.com/techs/vue" target="_blank">
                                    <img class="cursor-pointer" :src="'tech-icons/vue.png'" alt="Litlyx-Vue-Analytics">
                                    </a>
                                    <a href="https://docs.litlyx.com/techs/angular" target="_blank">
                                    <img class="cursor-pointer" :src="'tech-icons/angular.png'" alt="Litlyx-Angular-Analytics">
                                    </a>
                                    <a href="https://docs.litlyx.com/techs/python" target="_blank">
                                    <img class="cursor-pointer" :src="'tech-icons/py.png'" alt="Litlyx-Python-Analytics">
                                    </a>
                                    <a href="https://docs.litlyx.com/techs/serverless" target="_blank">
                                    <img class="cursor-pointer" :src="'tech-icons/serverless.png'" alt="Litlyx-Serverless-Analytics">
                                    </a>
                                </div>

                            </div>
                        </CardTitled>
                    </div>
                </div>
            </div>
        </div>





        <!-- <div class="flex justify-center gap-10 flex-col xl:flex-row items-center xl:items-stretch px-10">

            <div class="bg-menu p-6 rounded-xl flex flex-col gap-2 w-full">
                <div class="poppins font-semibold"> Copy your project_id: </div>
                <div class="flex items-center gap-2">
                    <div> <i @click="copyProjectId()" class="cursor-pointer hover:text-text far fa-copy"></i> </div>
                    <div class="text-[.9rem] text-[#acacac]"> {{ activeProject?._id }} </div>
                </div>
            </div>

            <div class="bg-menu p-6 rounded-xl flex flex-col gap-2 w-full xl:max-w-[40vw]">
                <div class="poppins font-semibold">
                    Start logging visits in 1 click | Plug anywhere !
                </div>
                <div class="flex items-center gap-4">
                    <div> <i @click="copyScript()" class="cursor-pointer hover:text-text far fa-copy"></i> </div>

                    <pre><code class="language-html">{{ scriptText }}</code></pre>

                </div>
            </div>

        </div> -->

    </div>

</template>
