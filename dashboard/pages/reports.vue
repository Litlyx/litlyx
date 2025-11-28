<script lang="ts" setup>
import { InfoIcon, Upload, Trash2, Lock } from 'lucide-vue-next';
import { toast } from 'vue-sonner';


definePageMeta({ layout: 'sidebar' });

const theme = ref<string>('');
const reportType = ref<string>('');
const loading = ref<boolean>(false);
const currentImageB64 = ref<string>('');

const pdfUrl = ref<string>('');

const snapshotStore = useSnapshotStore();
const projectStore = useProjectStore();
const domainStore = useDomainStore();
const premium = usePremiumStore();

const domain = ref<string>();

const canGenerate = computed(() => {
    if (reportType.value === 'custom') return theme.value && reportType.value;
    if (reportType.value === 'advanced') return domain.value && reportType.value;
    return reportType.value;
})


async function getInputLogo(e: any) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    const b64 = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = function () {
            const base64 = reader.result;
            if (!base64) throw Error('Error reading image');
            resolve(base64 as string);
        };
        reader.readAsDataURL(file);
    })

    currentImageB64.value = b64;


}

async function generateReport() {
    loading.value = true;

    if (pdfUrl.value !== '') {
        URL.revokeObjectURL(pdfUrl.value);
        pdfUrl.value = '';
    }
    const res = await useAuthFetchSync<any>(reportType.value === 'advanced' ? `/api/project/generate_pdf_adv?domain=${domain.value}` : `/api/project/generate_pdf?theme=${theme.value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            snapshotName: snapshotStore.activeSnapshot?.name ?? 'NO_NAME',
            customLogo: currentImageB64.value
        },
        responseType: 'blob'
    });

    const blob = new Blob([res], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    toast.info('Report', { position: 'top-right', description: `Report succesfully generated! (${reportType.value} report)` });

    pdfUrl.value = url
    loading.value = false;
    reportType.value = '';
    theme.value = '';
    currentImageB64.value = '';
}

async function resetPdfUrl() {
    URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = '';
}

async function downloadPdf() {
    const a = document.createElement('a');
    a.href = pdfUrl.value;
    a.download = `Litlyx_Report${reportType.value === 'advanced' ? '_Advanced' : ''}.pdf`;
    a.click();
    resetPdfUrl()
    toast.success('Success', { position: 'top-right', description: 'Report succesfully downloaded' });
}


const fileInput = ref<HTMLInputElement | null>(null)
const triggerFileInput = () => {
    fileInput.value?.click()
}
</script>

<template>
    <Unauthorized v-if="!projectStore.isOwner" authorization="Guest user limitation Reports">
    </Unauthorized>
    <div v-else class="grid grid-cols-1 poppins">
        <Card v-if="!pdfUrl" class="w-full justify-self-center">
            <CardHeader>
                <CardTitle class="flex gap-2">
                    Generate a report
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <InfoIcon class="size-4"></InfoIcon>
                        </TooltipTrigger>
                        <TooltipContent>
                            The report follows the current Timeframe
                        </TooltipContent>
                    </Tooltip>
                </CardTitle>
                <CardDescription>Generate a report of your workspace</CardDescription>
                <CardAction>
                    <div>
                        <div v-if="!loading" class="flex items-center gap-2">
                            <Button @click="generateReport()" :disabled="!canGenerate">Generate report</Button>
                        </div>
                        <Button v-else disabled>
                            <Loader class="!size-4"></Loader> Generating...
                        </Button>
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent class="flex justify-center lg:justify-start">
                <div class="gap-4"
                    :class="reportType === 'custom' ? 'grid grid-cols-1 lg:grid-cols-2' : 'flex flex-col'">
                    <div class="flex flex-col gap-4">
                        <Label>Report type </Label>
                        <Select v-model="reportType" :disabled="loading">
                            <SelectTrigger class="w-[20rem]">
                                <SelectValue placeholder="Report types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Types</SelectLabel>
                                    <SelectItem value="easy">
                                        Easy report
                                    </SelectItem>



                                    <SelectItem value="locked" disabled as-child
                                        v-if="!premium.planInfo?.features.customizable_report">
                                        <NuxtLink to="/plans"
                                            class="flex items-center gap-2 pl-4 py-2 rounded-md text-violet-200 bg-violet-500 hover:!bg-violet-600/80 dark:bg-violet-500/20 hover:dark:!bg-violet-500/30">
                                            <Lock class="size-4 text-yellow-500" /> Custom report
                                        </NuxtLink>
                                    </SelectItem>
                                    <SelectItem value="custom" v-else>
                                        Custom Report
                                    </SelectItem>

                                    <SelectItem value="locked" disabled as-child
                                        v-if="!premium.planInfo?.features.customizable_report">
                                        <NuxtLink to="/plans"
                                            class="flex items-center gap-2 pl-4 py-2 rounded-md text-violet-200 bg-violet-500 hover:!bg-violet-600/80 dark:bg-violet-500/20 hover:dark:!bg-violet-500/30">
                                            <Lock class="size-4 text-yellow-500" /> Advanced report
                                        </NuxtLink>
                                    </SelectItem>
                                    <SelectItem value="advanced" v-else>
                                        Advanced Report
                                    </SelectItem>


                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div v-if="reportType === 'custom'" class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <Label>Report variant</Label>
                                <Select v-model="theme" :disabled="loading">
                                    <SelectTrigger class="w-[20rem]">
                                        <SelectValue placeholder="Report variants" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="black">
                                                Black
                                            </SelectItem>
                                            <SelectItem value="white">
                                                White
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <!-- <div class="flex flex-col gap-2">
                                <Label>Custom Logo</Label>
                                <Input @input="getInputLogo" class="w-[20rem]" type="file"></Input>
                            </div> -->
                        </div>
                    </div>
                    <div v-if="reportType === 'custom'">
                        <div class="flex flex-col gap-4">
                            <Label>Your logo</Label>
                            <div
                                class="group bg-muted h-80 w-80 p-4 rounded-lg cursor-pointer hover:bg-muted/80 duration-300">

                                <input type="file" ref="fileInput" class="hidden" accept="image/*"
                                    @input="getInputLogo" />
                                <div v-if="currentImageB64 === ''" @click="triggerFileInput"
                                    class="flex justify-center items-center border-4 border-muted-foreground border-dashed h-full w-full rounded-sm group-hover:animate-pulse">
                                    <Upload
                                        class="size-8 group-hover:size-9 transition-all duration-300 text-muted-foreground" />
                                </div>
                                <div v-else class="relative">
                                    <Button :disabled="loading" class="absolute top-0 right-0"
                                        @click="currentImageB64 = ''" variant="ghost" size="icon">
                                        <Trash2 class="size-4" />
                                    </Button>
                                    <img :src="currentImageB64" alt="Preview"
                                        class="h-full w-full object-cover rounded" />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div v-if="reportType === 'advanced'">

                        <div class="flex flex-col gap-4">

                            <Label>Select domain</Label>

                            <Select v-model="domain">
                                <SelectTrigger class="w-[20rem]">
                                    <SelectValue placeholder="Domain" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="domain of domainStore.domains.slice(1)" :value="domain._id">
                                        {{ domain.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>


                            <Label>Your logo</Label>
                            <div
                                class="group bg-muted h-80 w-80 p-4 rounded-lg cursor-pointer hover:bg-muted/80 duration-300">

                                <input type="file" ref="fileInput" class="hidden" accept="image/*"
                                    @input="getInputLogo" />
                                <div v-if="currentImageB64 === ''" @click="triggerFileInput"
                                    class="flex justify-center items-center border-4 border-muted-foreground border-dashed h-full w-full rounded-sm group-hover:animate-pulse">
                                    <Upload
                                        class="size-8 group-hover:size-9 transition-all duration-300 text-muted-foreground" />
                                </div>
                                <div v-else class="relative">
                                    <Button :disabled="loading" class="absolute top-0 right-0"
                                        @click="currentImageB64 = ''" variant="ghost" size="icon">
                                        <Trash2 class="size-4" />
                                    </Button>
                                    <img :src="currentImageB64" alt="Preview"
                                        class="h-full w-full object-cover rounded" />
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </CardContent>
        </Card>
        <Card v-if="pdfUrl">
            <CardHeader class="flex justify-between">
                <div class="flex flex-col gap-2">
                    <CardTitle>
                        Report Preview
                    </CardTitle>
                    <CardDescription>Your report is now ready</CardDescription>
                </div>
                <div class="flex gap-4">
                    <Button variant="outline" @click="resetPdfUrl()">New Report</Button>
                    <Button @click="downloadPdf">Download</Button>
                </div>
            </CardHeader>
            <CardContent>
                <iframe :src="pdfUrl" type="application/pdf" class="w-full h-[50rem]" />
            </CardContent>
        </Card>
    </div>
</template>