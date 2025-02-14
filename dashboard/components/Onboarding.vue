<script lang="ts" setup>

const { data: needsOnboarding } = useFetch("/api/onboarding/exist", {
    headers: useComputedHeaders({ useSnapshotDates: false, useTimeOffset: false })
});

const route = useRoute();

const analyticsList = [
    "I have no prior analytics tool",
    "Google Analytics 4",
    "Plausible",
    "Umami",
    "MixPanel",
    "Simple Analytics",
    "Matomo",
    "Fathom",
    "Adobe Analytics",
    "Other"
]

const jobsList = [
    "Developer",
    "Marketing",
    "Product",
    "Startup founder",
    "Indie hacker",
    "Other",
]

const selectedIndex = ref<number>(-1);
const otherFieldVisisble = ref<boolean>(false);
const otherText = ref<string>('');
function selectIndex(index: number) {
    selectedIndex.value = index;
    otherFieldVisisble.value = index == analyticsList.length - 1;
}

const selectedIndex2 = ref<number>(-1);
const otherFieldVisisble2 = ref<boolean>(false);
const otherText2 = ref<string>('');
function selectIndex2(index: number) {
    selectedIndex2.value = index;
    otherFieldVisisble2.value = index == jobsList.length - 1;
}

const page = ref<number>(0);

function onNextPage() {
    if (selectedIndex.value == -1) return;
    saveAnalyticsType();
    page.value = 1;
}

function onFinish(skipped?: boolean) {
    if (skipped) return location.reload();
    if (selectedIndex2.value == -1) return;
    saveJobTitle();
    page.value = 2;
    location.reload();
}

async function saveAnalyticsType() {
    await $fetch('/api/onboarding/add', {
        headers: useComputedHeaders({
            useSnapshotDates: false, useTimeOffset: false,
            custom: { 'Content-Type': 'application/json' }
        }).value,
        method: 'POST',
        body: JSON.stringify({
            analytics:
                selectedIndex.value == analyticsList.length - 1 ?
                    otherText.value :
                    analyticsList[selectedIndex.value]
        })
    })
}

async function saveJobTitle() {

    await $fetch('/api/onboarding/add', {
        headers: useComputedHeaders({
            useSnapshotDates: false, useTimeOffset: false,
            custom: { 'Content-Type': 'application/json' }
        }).value,
        method: 'POST',
        body: JSON.stringify({
            job:
                selectedIndex2.value == jobsList.length - 1 ?
                    otherText2.value :
                    jobsList[selectedIndex2.value]
        })
    })
}



const showOnboarding = computed(() => {
    if (route.path === '/login') return false;
    if (route.path === '/register') return false;
    if ((needsOnboarding.value as any)?.exist === false) return true;
    if ((needsOnboarding.value as any)?.exists === false) return true;
})

</script>


<template>
    <div v-if="showOnboarding" class="absolute top-0 left-0 w-full h-full z-[30] bg-black/80 flex justify-center">



        <div v-if="page == 0" class="bg-lyx-lightmode-background-light dark:bg-lyx-background-light mt-[10vh] w-[50vw] min-w-[400px] h-fit p-8 rounded-md">

            <div class="text-lyx-lightmode-text dark:text-lyx-text text-[1.4rem] text-center font-medium"> Getting Started </div>

            <div class="text-lyx-lightmode-text dark:text-lyx-text mt-4">
                For the current project do you already have other Analytics tools implemented (e.g. GA4) or Litlyx is
                going to be your first/main analytics?
            </div>

            <div class="grid grid-cols-2 gap-3 mt-8">
                <div v-for="(e, i) of analyticsList">
                    <div @click="selectIndex(i)"
                        :class="{ 'outline outline-[1px] outline-[#5680f8]': selectedIndex == i }"
                        class="bg-lyx-lightmode-widget-light dark:bg-lyx-widget-light text-center p-2 rounded-md cursor-pointer">
                        {{ e }}
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <LyxUiInput v-if="otherFieldVisisble" class="w-full !rounded-md py-2 px-2" placeholder="Please specify"
                    v-model="otherText"></LyxUiInput>
            </div>

            <div class="mt-6 flex justify-center flex-col items-center">
                <LyxUiButton @click="onNextPage()" class="px-[8rem] py-2" :disabled="selectedIndex == -1"
                    type="primary"> Next </LyxUiButton>
                <!-- <div class="mt-2 text-lyx-text-darker cursor-pointer"> Skip </div> -->
            </div>

        </div>
        <div v-if="page == 1" class="bg-lyx-lightmode-background-light dark:bg-lyx-background-light mt-[10vh] w-[50vw] min-w-[400px] h-fit p-8 rounded-md">

            <div class="text-lyx-lightmode-text dark:text-lyx-text text-[1.4rem] text-center font-medium"> Getting Started </div>

            <div class="text-lyx-lightmode-text dark:text-lyx-text mt-4">
                What is your job title ?
            </div>

            <div class="grid grid-cols-2 gap-3 mt-8">
                <div v-for="(e, i) of jobsList">
                    <div @click="selectIndex2(i)"
                        :class="{ 'outline outline-[1px] outline-[#5680f8]': selectedIndex2 == i }"
                        class="bg-lyx-lightmode-widget-light dark:bg-lyx-widget-light text-center p-2 rounded-md cursor-pointer">
                        {{ e }}
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <LyxUiInput v-if="otherFieldVisisble2" class="w-full !rounded-md py-2 px-2" placeholder="Please specify"
                    v-model="otherText2"></LyxUiInput>
            </div>

            <div class="mt-6 flex justify-center flex-col items-center">
                <LyxUiButton @click="onFinish()" class="px-[8rem] py-2" :disabled="selectedIndex2 == -1" type="primary">
                    Finish </LyxUiButton>
                <div @click="onFinish(true)" class="mt-2 text-lyx-text-darker cursor-pointer"> Skip </div>
            </div>

        </div>

    </div>
</template>