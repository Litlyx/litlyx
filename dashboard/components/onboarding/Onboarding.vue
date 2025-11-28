<script lang="ts" setup>
import { ArrowRightIcon, Flag, LoaderCircle } from 'lucide-vue-next';


const currentAnalytic = ref<string>('');
const otherAnalytic = ref<string>('');

watch(currentAnalytic, () => {
    if (currentAnalytic.value.length > 0) otherAnalytic.value = '';
});

watch(otherAnalytic, () => {
    if (otherAnalytic.value.trim().length > 0) currentAnalytic.value = '';
})

const currentJob = ref<string>('');
const otherJob = ref<string>('');

watch(currentJob, () => {
    if (currentJob.value.length > 0) otherJob.value = '';
});

watch(otherJob, () => {
    if (otherJob.value.trim().length > 0) currentJob.value = '';
})

const page = ref<number>(1);

async function sendOnboarding() {
    page.value = 3;
    await useCatch({
        toast: true,
        toastTitle: 'Error sending onboarding',
        async action() {
            await useAuthFetchSync('/api/user/onboarding/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    job: currentJob.value.length > 0 ? currentJob.value : otherJob.value,
                    analytics: currentAnalytic.value.length > 0 ? currentAnalytic.value : otherAnalytic.value
                }
            })
        },
        onSuccess() {
            useAuthFetch<{ exists: boolean }>('/api/user/onboarding/exists', { key: 'onboarding' })
        },
    })
}

</script>

<template>
    <div class="flex justify-center w-dvw h-dvh absolute top-0 left-0 bg-background/80 z-[100] backdrop-blur-[2px]">

        <Card class="flex bg-background w-[80dvw] lg:w-[40dvw] h-fit mt-[20vh]">
            <CardHeader>
                <CardTitle> Getting started </CardTitle>
            </CardHeader>
            <CardContent>

                <div v-if="page == 1" class="flex flex-col gap-4">

                    <div class="poppins text-center px-4">
                        Do you already have other Analytics tools implemented (e.g. GA4) or Litlyx is going to be your
                        first/main analytics?
                    </div>

                    <ToggleGroup v-model="currentAnalytic" type="single"
                        class="flex flex-col gap-2 w-full *:w-full *:rounded-lg *:border-solid *:border-[1px] *:py-[.5rem]">
                        <ToggleGroupItem value="No prior analytics tool">
                            No prior analytics tool
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Google analytics 4">
                            Google analytics 4
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Plausible">
                            Plausible
                        </ToggleGroupItem>
                        <ToggleGroupItem value="MixPanel">
                            MixPanel
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Simple analytics">
                            Simple analytics
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <Input v-model="otherAnalytic" placeholder="Other" class="h-[2rem] rounded-lg"></Input>

                    <Button size="lg" @click="page = 2"
                        :disabled="currentAnalytic.length == 0 && otherAnalytic.trim().length == 0" class="w-full">
                        Next
                        <ArrowRightIcon></ArrowRightIcon>
                    </Button>

                </div>

                <div v-if="page == 2" class="flex flex-col gap-4">

                    <div class="poppins text-center px-4">
                        What is your job title?
                    </div>

                    <ToggleGroup v-model="currentJob" type="single"
                        class="flex flex-col gap-2 w-full *:w-full *:rounded-lg *:border-solid *:border-[1px] *:py-[.5rem]">
                        <ToggleGroupItem value="Developer">
                            Developer
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Marketing">
                            Marketing
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Product">
                            Product
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Indie hacker">
                            Indie hacker
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Startup founder">
                            Startup founder
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <Input v-model="otherJob" placeholder="Other" class="h-[2rem] rounded-lg"></Input>


                    <div class="flex flex-col gap-1">
                        <Button size="lg" @click="sendOnboarding()"
                            :disabled="currentJob.length == 0 && otherJob.trim().length == 0" class="w-full">
                            Confirm
                        </Button>

                        <Button @click="sendOnboarding()" variant="link" class="cursor-pointer">
                            <span class="text-muted-foreground">Skip</span>
                        </Button>
                    </div>

                </div>

                <div v-if="page == 3" class="flex justify-center items-center h-[10rem]">
                    <LoaderCircle class="size-10 animate-[spin_1s_ease-in-out_infinite] duration-500">
                    </LoaderCircle>
                </div>

            </CardContent>
        </Card>

    </div>
</template>