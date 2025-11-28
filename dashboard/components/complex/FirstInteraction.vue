<script lang="ts" setup>
import { CopyIcon } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import GuidedSetup from './GuidedSetup.vue';

const projectStore = useProjectStore();

const scriptValue = [
    { text: '<', color: '#35a4f1' },
    { text: 'script ', color: '#f07178' },
    { text: 'defer ', color: '#c792ea' },
    { text: 'data-workspace', color: '#c792ea' },
    { text: '=', color: '#35a4f1' },
    { text: "\"", color: '#b9e87f' },
    { text: projectStore.activeProject?._id.toString(), color: '#b9e87f' },
    { text: "\"", color: '#b9e87f' },
    { text: " src", color: '#c792ea' },
    { text: '=', color: '#35a4f1' },
    { text: "\"", color: '#b9e87f' },
    { text: "https://cdn.jsdelivr.net/gh/litlyx/litlyx-js@latest/browser/litlyx.js", color: '#b9e87f' },
    { text: "\"", color: '#b9e87f' },
    { text: '>', color: '#35a4f1' },
    { text: '</', color: '#35a4f1' },
    { text: 'script', color: '#f07178' },
    { text: '>', color: '#35a4f1' },
]

function copyScript() {
    if (!navigator.clipboard) return toast('Error', { position: 'top-right', description: 'Error copying' });
    navigator.clipboard.writeText(scriptValue.map(e => e.text).join(''));
    return toast('Success', { position: 'top-right', description: 'Project script is in the clipboard' });
}

function copyProjectId() {
    if (!navigator.clipboard) return toast('Error', { position: 'top-right', description: 'Error copying' });
    navigator.clipboard.writeText(projectStore.activeProject?._id.toString() ?? 'ERROR_COPYING_PROJECT');
    return toast('Success', { position: 'top-right', description: 'Project id is in the clipboard' });
}


const techs = [
    { name: 'Wordpress', link: 'https://docs.litlyx.com/techs/wordpress', icon: 'logos:wordpress-icon' },
    { name: 'Shopify', link: 'https://docs.litlyx.com/techs/shopify', icon: 'logos:shopify' },
    { name: 'Google Tag Manager', link: 'https://docs.litlyx.com/techs/google-tag-manager', icon: 'logos:google-tag-manager' },
    { name: 'Javascript', link: 'https://docs.litlyx.com/techs/js', icon: 'logos:javascript' },
    { name: 'Nuxt', link: 'https://docs.litlyx.com/techs/nuxt', icon: 'logos:nuxt-icon' },
    { name: 'Next', link: 'https://docs.litlyx.com/techs/next', icon: 'logos:nextjs-icon' },
    { name: 'React', link: 'https://docs.litlyx.com/techs/0react', icon: 'logos:react' },
    { name: 'Vue', link: 'https://docs.litlyx.com/techs/vue', icon: 'logos:vue' },
    { name: 'Angular', link: 'https://docs.litlyx.com/techs/angular', icon: 'logos:angular-icon' },
    { name: 'Python', link: 'https://docs.litlyx.com/techs/py', icon: 'logos:python' },
    { name: 'Serverless', link: 'https://docs.litlyx.com/techs/serverless', icon: 'logos:serverless' }

]

const setupGuidato = ref(true)
</script>

<template>
  <template v-if="setupGuidato">
    <GuidedSetup v-model:active="setupGuidato" />
  </template>
  <template v-else>

 
    <div class="flex flex-col gap-4 poppins">
        <div class="bg-gradient-to-r from-violet-500/20 to-transparent rounded-md">
            <div class=" m-[1px] p-4 rounded-md">
                <div class="flex  items-center justify-between">
                    <span class="flex flex-row">
                    <Loader class="h-6" />
                    <p class="pl-2 font-medium text-md">Waiting for your first visit..</p>
                    </span>
<Button @click="setupGuidato = true">Guided Setup</Button>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Tag script
                    </CardTitle>
                    <CardDescription>
                        Start tracking web analytics in one line.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-col gap-4">
                        <p class="text-sm text-muted-foreground ">Place it in your <span
                                class="text-muted-foreground dark:text-white font-medium">{{ `<head>` }}
                            </span> or just before closing 
                            <span class="text-muted-foreground dark:text-white font-medium">{{ `<body>` }}
                            </span> tag</p>
                        <div class="bg-gray-700 dark:bg-accent/50 p-4 rounded-md relative">
                            <div @click="copyScript()"
                                class="absolute top-4 right-4 text-white/80 hover:text-muted-foreground cursor-pointer">
                                <CopyIcon class="size-4"></CopyIcon>
                            </div>
                            <span v-for="e of scriptValue" :style="`color: ${e.color};`" class="text-[13px]">
                                {{ e.text }}
                            </span>
                        </div>

                        <label class="text-sm">
                            <span class="pr-2">Workspace id:</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Icon name="lucide:info" class="align-middle" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right" class="max-w-100">
                                        <p>If you are using a framework like <b>React</b>, <b>Vue</b>, or <b>Next</b>,
                                            copy the following ID into your <code
                                                class="text-violet-800">Lit.init("workspace_id")</code> function.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </label>
                        <div class="bg-gray-700 dark:bg-accent/50 p-4 rounded-md relative">
                            <div @click="copyProjectId()"
                                class="absolute top-4 right-4 text-white/80 hover:text-muted-foreground cursor-pointer">
                                <CopyIcon class="size-4"></CopyIcon>
                            </div>
                            <span class="text-[13px] text-white">{{ projectStore.pid ?? '' }}</span>
                        </div>


                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Integrations
                    </CardTitle>
                    <CardDescription>
                        Get started with your favourite integration.
                    </CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col gap-4">
                    <div class="flex flex-wrap place-content-center gap-4">
                        <TooltipProvider v-for="e of techs">
                            <Tooltip>
                                <TooltipTrigger>
                                    <NuxtLink :to="e.link" target="_blank">
                                        <div
                                            class="border-solid border-[1px] rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-transparent hover:dark:bg-gray-100/5 flex justify-center">
                                            <Icon class="size-6 m-[1.5rem]" :name="e.icon" mode="svg"></Icon>
                                        </div>
                                    </NuxtLink>
                                </TooltipTrigger>
                                <TooltipContent side="top" class="max-w-100">
                                    {{ e.name }}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div class="bg-violet-500/20 p-4 rounded-md flex justify-between items-center">
                        <div class="flex flex-col">
                            <label>Need Help?</label>
                            <p class="text-[13px]">visit the docs or contact us at <span
                                    class="font-medium">help@litlyx.com</span>.</p>
                        </div>

                        <NavLink to="/docs">
                            <Button>Visit Docs</Button>
                        </NavLink>
                    </div>
                </CardContent>
            </Card>

        </div>
    </div>
    </template>
</template>