<script lang="ts" setup>


definePageMeta({ layout: 'dashboard' });

const customization = ref<any>();

const { snapshot } = useSnapshot();
const { showDrawer } = useDrawer();

const { isPremium } = useLoggedUser()

onMounted(async () => {
    const res = await $fetch('/api/report/customization', {
        headers: useComputedHeaders().value
    })
    customization.value = res;
})

async function updateCustomization() {
    await $fetch('/api/report/update_customization', {
        method: 'POST',
        headers: useComputedHeaders({
            custom: {
                'Content-Type': 'application/json'
            }
        }).value,
        body: JSON.stringify(customization.value)
    })
}

const generating = ref<boolean>(false);

async function generateReport(type: number) {
    if (generating.value === true) return;
    generating.value = true;
    try {
        const res = await $fetch<Blob>(`/api/project/generate_pdf?type=${type}`, {
            headers: useComputedHeaders({
                useSnapshotDates: false, custom: {
                    'x-snapshot-name': snapshot.value.name
                }
            }).value,
            responseType: 'blob'
        });

        const url = URL.createObjectURL(res);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Report.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (ex: any) {
        alert(ex.message);
    }

    generating.value = false;
}


function selectColor(color: string) {
    customization.value.bg = color;
    updateCustomization();
}

function onFileSelected(e: string) {
    customization.value.logo = e;
    updateCustomization();
}


</script>

<template>
    <div class="p-6">
        <div class="flex flex-col gap-4">
            <CardTitled class="w-full h-full" title="Choose a report" sub="Select a report type">
                <div class="w-full flex gap-4 h-[18rem]">
                    <LyxUiCard class="flex-1 h-full">
                        <div @click="generateReport(1)"
                            :class="{ 'cursor-pointer hover:text-lyx-text-darker': !generating }"
                            class="flex justify-center items-center text-[1.2rem] h-full">
                            <div v-if="!generating"> Easy report </div>
                            <div v-if="generating" class="flex justify-center pb-8 text-[1.2rem]">
                                <i class="fas fa-loader animate-spin"></i>
                            </div>
                        </div>
                    </LyxUiCard>
                    <LyxUiCard class="flex-1 h-full">
                         <div class="flex justify-center items-center text-[1.2rem] h-full">
                            <div class="text-gray-400">(coming soon)</div>
                        </div>
                    </LyxUiCard>
                </div>
            </CardTitled>
            <div class="flex gap-4">
                <CardTitled class="w-full h-full relative" title="Customize theme" sub="Choose the report colors">
                    <div v-if="!isPremium" @click="showDrawer('PRICING')"
                        class="absolute w-full h-full top-0 left-0 bg-black/80 rounded-lg flex items-center justify-center gap-1">
                        <div class="text-amber-300"> <i class="far fa-lock"></i> </div>
                        <div class="text-amber-300"> Premium only </div>
                    </div>
                    <div v-if="customization" class="w-full flex gap-2 h-[18rem]">
                        <div @click="selectColor('white')"
                            class="flex items-center justify-center rounded-lg bg-white border-solid border-[1px] border-gray-200 cursor-pointer w-[4rem] h-[2rem]">
                            <i v-if="customization.bg == 'white'" class="fas fa-check text-blue-600"></i>
                        </div>
                        <div @click="selectColor('black')"
                            class="flex items-center justify-center rounded-lg bg-black border-solid border-[1px] border-gray-200 cursor-pointer w-[4rem] h-[2rem]">
                            <i v-if="customization.bg == 'black'" class="fas fa-check text-blue-600"></i>
                        </div>
                    </div>
                </CardTitled>
                <CardTitled class="w-full h-full relative" title="Customize logo" sub="Upload your logo">
                    <div v-if="!isPremium" @click="showDrawer('PRICING')"
                        class="absolute w-full h-full top-0 left-0 bg-black/80 rounded-lg flex items-center justify-center gap-1">
                        <div class="text-amber-300"> <i class="far fa-lock"></i> </div>
                        <div class="text-amber-300"> Premium only </div>
                    </div>
                    <div v-if="customization" style="height: 18rem;" class="w-full flex gap-4">
                        <img v-if="customization.logo" :src="customization.logo" class="w-[256px] h-[256px]">
                        <div class="flex h-[10rem]">
                            <SelectorImageSelector class="w-fit" @file_selected="onFileSelected">
                            </SelectorImageSelector>
                        </div>
                    </div>
                </CardTitled>
            </div>
        </div>

    </div>
</template>