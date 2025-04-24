<script lang="ts" setup>


definePageMeta({ layout: 'dashboard' });

const customization = ref<any>();

const { snapshot } = useSnapshot();

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

async function generateReport(type: number) {
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
                <div style="height: 18rem;" class="w-full flex gap-4">
                    <LyxUiCard>
                        <div @click="generateReport(1)" class="cursor-pointer hover:text-lyx-text-darker">
                            Easy report
                        </div>
                    </LyxUiCard>
                    <LyxUiCard>
                        <div @click="generateReport(1)" class="cursor-pointer hover:text-lyx-text-darker">
                            Product report
                        </div>
                    </LyxUiCard>
                </div>
            </CardTitled>
            <div class="flex gap-4">
                <CardTitled class="w-full h-full" title="Customize theme" sub="Choose the report colors">
                    <div v-if="customization" style="height: 18rem;" class="w-full flex gap-2">
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
                <CardTitled class="w-full h-full" title="Customize logo" sub="Upload your logo">
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