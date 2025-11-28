<script setup lang="ts">
import { toast } from 'vue-sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { BookUser, CreditCard, Truck, Check, TriangleAlert, CopyIcon, Trash } from 'lucide-vue-next'

const props = defineProps({
  active: Boolean
})

const emit = defineEmits(['update:active'])

function close() {
  emit('update:active', false)
}

//STEPS
const currentStep = ref(1)

const steps = ref<{ step: number; title: string; icon: any; done: boolean; }[]>([
  {
    step: 1,
    title: 'Add Website Info',
    icon: BookUser,
    done: false,
  },
  {
    step: 2,
    title: 'Install Litlyx',
    icon: Truck,
    done: false,
  },
  {
    step: 3,
    title: 'Verify Installation',
    icon: CreditCard,
    done: false,
  },
])

//STEP 1 - Install Litlyx
const installDomain = ref<string>('')
const autoInstallDomain = ref<boolean>(false)

const checkDomain = computed(() => {
  return autoInstallDomain.value || installDomain.value.trim() !== ''
})

const { data: domains, refresh: domainsRefresh } = useAuthFetch('/api/shields/domains/list');

watch(() => domains.value, (newDomains) => {
  if (Array.isArray(newDomains) && newDomains.length >= 1) {
    currentStep.value = 2;
    installDomain.value = newDomains[0];
    steps.value[0].done = true;
  } else {
    currentStep.value = 1;
  }
},
  { immediate: true }
);

const router = useRouter();

//Remove Domain
async function removeInstallDomain() {
  await useCatch({
    toast: true,
    toastTitle: 'Error deleting domain',
    async action() {
      await useAuthFetchSync('/api/shields/domains/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: installDomain.value })
      })
    },
    onSuccess(_, showToast) {
      showToast('Domain deleted', { description: 'Domain deleted successfully', position: 'top-right' });
      domainsRefresh();
      steps.value[0].done = false;
      installDomain.value = '';
    },
  })
}
//Tasto proseguimento
async function endSetup(step: number) {
  if (step === 1) {
    if (!checkDomain.value && (!domains.value || domains.value.length === 0)) {
      return;
    }
    if (autoInstallDomain.value === false) {
      await useCatch({
        toast: true,
        toastTitle: 'Error adding domain',
        async action() {
          await useAuthFetchSync('/api/shields/domains/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: installDomain.value })
          })
        },
        onSuccess(_, showToast) {
          showToast('Domain added', { description: 'Domain added successfully', position: 'top-right' });
          domainsRefresh();
          steps.value[0].done = true;
          currentStep.value = 2;
        },
      })
    } else {
      toast.info('Info', { description: 'Domain will be auto detected in verify installation', position: 'top-right' });
      steps.value[0].done = true;
      currentStep.value = 2;
    }

  } else if (step === 2) {
    steps.value[1].done = true;
    currentStep.value = 3;
    await new Promise(e => setTimeout(e, 3000));
    await projectStore.fetchFirstInteraction();
    if (!projectStore.firstInteraction) {
      steps.value[1].done = false;
      currentStep.value = 2;
      toast.error('Domain verification', { description: 'Cannot verify your domain, try again', position: 'top-right' });
    } else {
      router.push('/')
    }
  }
}


//Scripts
const projectStore = useProjectStore();

const litlyxScript = [
  { text: '<', color: '#35a4f1' },
  { text: 'script ', color: '#f07178' },
  { text: 'defer ', color: '#c792ea' },
  { text: 'data-workspace', color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: "\"", color: '#b9e87f' },
  { text: projectStore.activeProject?._id?.toString() ?? '', color: '#b9e87f' },
  { text: "\"", color: '#b9e87f' },
  { text: " \nsrc", color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: "\"", color: '#b9e87f' },
  { text: "https://cdn.jsdelivr.net/npm/litlyx-js@latest/browser/litlyx.js", color: '#b9e87f' },
  { text: "\"", color: '#b9e87f' },
  { text: '>', color: '#35a4f1' },
  { text: '</', color: '#35a4f1' },
  { text: 'script', color: '#f07178' },
  { text: '>', color: '#35a4f1' },
]

const googleTagScript = [
  { text: '<', color: '#35a4f1' },
  { text: 'script', color: '#f07178' },
  { text: '>\n', color: '#35a4f1' },
  { text: 'var', color: '#c792ea' },
  { text: ' script', color: '#8ac1e7' },
  { text: ' = ', color: '#35a4f1' },
  { text: "document.", color: '#8ac1e7' },
  { text: "createElement('script');\n", color: '#8ac1e7' },

  { text: 'script.defer', color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: "true\n", color: '#8ac1e7' },
  { text: 'script.dataset.project', color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: "\"", color: '#b9e87f' },
  { text: projectStore.activeProject?._id?.toString() ?? '', color: '#b9e87f' },
  { text: "\"", color: '#b9e87f' },
  { text: "\nscript.src", color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: "\"", color: '#b9e87f' },
  { text: "https://cdn.jsdelivr.net/npm/litlyx-js@latest/browser/litlyx.js", color: '#b9e87f' },
  { text: "\"", color: '#b9e87f' },

  { text: `\ndocument.getElementsByTagName('head')[0].appendChild(script);\n`, color: '#c792ea' },
  { text: '</', color: '#35a4f1' },
  { text: 'script', color: '#f07178' },
  { text: '>', color: '#35a4f1' },
]

const inHouseScript = [
  { text: '<', color: '#35a4f1' },
  { text: 'script ', color: '#f07178' },
  
  // src
  { text: 'src', color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: '"', color: '#b9e87f' },
  { text: 'https://cdn.jsdelivr.net/npm/litlyx-js@latest/browser/litlyx.js', color: '#b9e87f' },
  { text: '"', color: '#b9e87f' },
  
  // data-workspace
  { text: '\n data-workspace', color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: '"', color: '#b9e87f' },
  { text: projectStore.activeProject?._id?.toString() ?? '', color: '#b9e87f' },
  { text: '"', color: '#b9e87f' },

  // data-host
  { text: '\n data-host', color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: '"', color: '#b9e87f' },
  { text: 'your-host', color: '#b9e87f' },
  { text: '"', color: '#b9e87f' },

  // data-port
  { text: '\n data-port', color: '#c792ea' },
  { text: ' = ', color: '#35a4f1' },
  { text: '"', color: '#b9e87f' },
  { text: 'your-port', color: '#b9e87f' },
  { text: '"', color: '#b9e87f' },

  // chiusura tag
  { text: '>', color: '#35a4f1' },
  { text: '</', color: '#35a4f1' },
  { text: 'script', color: '#f07178' },
  { text: '>', color: '#35a4f1' },
];


function copyScript(name: { text: string; color: string }[]) {
  if (!navigator.clipboard) return toast.error('Error', { position: 'top-right', description: 'Error copying' });
  navigator.clipboard.writeText(name.map(e => e.text).join(''));
  return toast.success('Success', { position: 'top-right', description: 'The workspace script has been copied to your clipboard' });
}

function copyProjId() {
  navigator.clipboard.writeText(projectStore.activeProject?._id?.toString() ?? '')
  toast.success('Success', { position: 'top-right', description: 'The workspace id has been copied to your clipboard' });
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

//Timezone
function getUserTimezoneLabel(): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMinutes = -new Date().getTimezoneOffset(); // invertito perché getTimezoneOffset è negativo per UTC+

  const sign = offsetMinutes >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offsetMinutes) / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (Math.abs(offsetMinutes) % 60)
    .toString()
    .padStart(2, '0');

  return `(GMT${sign}${hours}:${minutes}) ${timeZone}`;
}
</script>


<template>
  <Unauthorized v-if="!projectStore.isOwner" authorization="Guest user limitation in Setup">
  </Unauthorized>
  <div v-else class="flex flex-col gap-12 p-4  text-white poppins">
    <div class="flex justify-center gap-2 items-center">
      <template v-for="(step, index) in steps" :key="step.step">
        <!-- STEP -->
        <div @click="(steps[index].done || steps[index - 1]?.done) && (currentStep = step.step)"
          class="flex flex-col text-center lg:flex-row lg:text-start items-center gap-2 cursor-pointer">
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" :class="{
            'bg-gray-800 text-white dark:bg-white dark:text-muted': currentStep === step.step,
            'bg-violet-500 dark:bg-violet-400/50 text-white': step.done && currentStep !== step.step,
            'bg-muted-foreground text-muted': !step.done && currentStep !== step.step
          }">
            <Check v-if="step.done" class="size-4" />
            <span v-else>{{ step.step }}</span>
          </div>
          <span class="text-sm" :class="{
            'text-gray-500 dark:text-gray-200': currentStep === step.step,
            'text-gray-400 ': !step.done && currentStep !== step.step,
            'text-gray-800 dark:text-white': step.done && currentStep !== step.step
          }">
            {{ step.title }}
          </span>
        </div>

        <!-- SEPARATOR (solo se non è l'ultimo) -->
        <div v-if="index < steps.length - 1" class="h-0.5 w-10 bg-sidebar-accent mx-2"></div>
      </template>
    </div>
    <div class="flex justify-center">
      <!-- Contenuto dello step selezionato -->
      <Card class="max-w-[80dvw] md:max-w-[40dvw] min-w-[40dvw] ">
        <div v-if="currentStep === 1">
          <CardHeader>
            <CardTitle>Add Website Info</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col gap-8">

            <Alert class="mt-4 border-yellow-500">
              <TriangleAlert class="size-4 !text-yellow-500" />
              <AlertTitle>Before start</AlertTitle>
              <AlertDescription>
                When you create your first workspace, your account will enter in a 30 days free trial period.
              </AlertDescription>
            </Alert>

            <div class="space-y-1">
              <div class="flex justify-between gap-2 items-center">
                <h1 class="text-[16px] font-semibold lg:text-lg">Domain</h1>
                <span class="text-sm items-center flex gap-2">{{ autoInstallDomain ? 'Auto detect' : 'Manual mode' }}
                  <Switch v-model="autoInstallDomain" />
                </span>

              </div>
              <div v-if="autoInstallDomain">
                <PageHeader description="Domain will be automatically detected" />
              </div>
              <div v-else class="flex flex-col gap-2">
                <PageHeader description="Just the naked domain or subdomain without 'www', 'https' etc." />
                <div class="flex gap-4">
                  <Input placeholder="example.com" v-model="installDomain"
                    :disabled="(domains && domains.length >= 1)" />
                  <Button v-if="domains && domains.length >= 1" @click="removeInstallDomain()" size="icon">
                    <Trash class="size-4" />
                  </Button>
                </div>
                <span class="text-sm text-muted-foreground">We store this in <strong>Shields</strong>, and only this
                  domain is
                  authorized to collect data.</span>

              </div>
            </div>

            <div class="space-y-1">
              <PageHeader title="Timezone" description="Litlyx find your Timezone automatically." />
              <div class="rounded-md p-2 w-full border text-sm text-gray-950/50 dark:text-gray-50/50 select-none">
                {{ getUserTimezoneLabel() }}
              </div>
            </div>
            <Button :disabled="!checkDomain || (domains && domains.length >= 1)" @click="endSetup(1)">{{ domains &&
              (domains && domains.length >= 1) ? 'Domain Added' : 'Install Litlyx' }}</Button>
          </CardContent>
        </div>
        <div v-else-if="currentStep === 2">
          <CardHeader>
            <CardTitle>Install Litlyx</CardTitle>
            <CardDescription>Paste this snippet into the
              <strong>
                <span v-pre>&lt;head&gt;</span>
              </strong>
              or at the end of <strong><span v-pre>&lt;/body&gt;</span></strong> tag section of your website.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-8">

            <div class="flex justify-start  ">
              <Tabs default-value="manual" class="mt-4 w-full">
                <TabsList class="grid grid-cols-3  w-full">
                  <TabsTrigger value="manual" class="truncate">
                    Manual
                  </TabsTrigger>
                  <TabsTrigger value="googletm" class="truncate">
                    Google Tag Manager
                  </TabsTrigger>
                  <TabsTrigger value="in-house">
                    Advanced
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="in-house" class="flex flex-col gap-4">
                  <div class="bg-gray-700 dark:bg-accent/50 p-4 rounded-md relative">
                    <div @click="copyScript(inHouseScript)"
                      class="absolute top-4 right-4 text-white/80 hover:text-muted-foreground cursor-pointer">
                      <CopyIcon class="size-4"></CopyIcon>
                    </div>
                    <span v-for="e of inHouseScript" :style="`color: ${e.color};`" class="text-[13px] whitespace-pre">
                      {{ e.text }}
                    </span>
                  </div>
                  <p class="text-sm text-muted-foreground">Litlyx lets you integrate JSON data responses into your
                    in-house
                    services, providing seamless data transfer and easy synchronization with your existing workflows.
                  </p>
                </TabsContent>
                <TabsContent value="manual" class="flex flex-col gap-4">
                  <div class="bg-gray-700 dark:bg-accent/50 p-4 rounded-md relative">
                    <div @click="copyScript(litlyxScript)"
                      class="absolute top-4 right-4 text-white/80 hover:text-muted-foreground cursor-pointer">
                      <CopyIcon class="size-4"></CopyIcon>
                    </div>
                    <span v-for="e of litlyxScript" :style="`color: ${e.color};`" class="text-[13px] whitespace-pre">
                      {{ e.text }}
                    </span>
                  </div>
                  <p class="text-sm text-muted-foreground">Litlyx works everywhere! From Vibe Coding tools like Cursor
                    to
                    frameworks like Nuxt or Vue, site builders like Framer or Wordpress and even Shopify.</p>
                  <div class="flex flex-wrap place-content-center gap-2">
                    <TooltipProvider v-for="e of techs">
                      <Tooltip>
                        <TooltipTrigger>
                          <NuxtLink :to="e.link" target="_blank">
                            <div
                              class="border-solid border-[1px] rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-transparent hover:dark:bg-gray-100/5 flex justify-center">
                              <Icon class="size-8 m-4" :name="e.icon" mode="svg"></Icon>
                            </div>
                          </NuxtLink>
                        </TooltipTrigger>
                        <TooltipContent side="top" class="max-w-100">
                          {{ e.name }}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>
                <TabsContent value="googletm">
                  <div class="bg-gray-700 dark:bg-accent/50 p-4 rounded-md relative">
                    <div @click="copyScript(googleTagScript)"
                      class="absolute top-4 right-4 text-white/80 hover:text-muted-foreground cursor-pointer">
                      <CopyIcon class="size-4"></CopyIcon>
                    </div>
                    <span v-for="e of googleTagScript" :style="`color: ${e.color};`"
                      class="text-[13px] whitespace-pre ">
                      {{ e.text }}
                    </span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <Label>Workspace Id</Label>
              <div class="bg-gray-700 dark:bg-accent/50 p-4 rounded-md relative mt-2">
                <div @click="copyProjId()"
                  class="absolute top-4 right-4 text-white/80 hover:text-muted-foreground cursor-pointer">
                  <CopyIcon class="size-4"></CopyIcon>
                </div>
                <span class="text-[13px] text-white whitespace-pre ">
                  {{ projectStore.activeProject?._id?.toString() ?? '' }}
                </span>
              </div>
            </div>
            <span class="text-sm text-muted-foreground">
              Visit our <NuxtLink to="https://docs.litlyx.com/quickstart" alt="Quick Start Litlyx"
                class="text-black dark:text-white underline underline-offset-2">Quick Start</NuxtLink> in our
              documentation.
            </span>
            <Button @click="endSetup(2)">Verify Installation</Button>
          </CardContent>

        </div>
        <div v-else-if="currentStep === 3">
          <CardContent class="my-8">
            <div class="flex items-center justify-center gap-4 ">

              <div class="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                <div class="bg-violet-500 rounded-full size-2 animate-pulse"></div>
              </div>
              <PageHeader title="Verifying your installation.."
                description="We're checking everything is working fine!" />
            </div>

          </CardContent>
        </div>
        <CardFooter>
          <div class="text-xs">
            <p>If you have any problems, we are here to help you and assist your installation.</p>
            <p>Contact us on <strong>help@litlyx.com</strong>.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>

</template>