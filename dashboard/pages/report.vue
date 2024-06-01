<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });

const activeProject = useActiveProject();


async function generatePDF() {
    const res = await $fetch<Blob>('/api/project/generate_pdf', {
        ...signHeaders(),
        responseType: 'blob'
    });

    const url = URL.createObjectURL(res);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}

</script>


<template>

    <div class="home w-full h-full px-10 lg:px-0">

        <div class="flex flex-col items-center justify-center mt-20 gap-20">

            <div class="flex flex-col items-center justify-center gap-10">
                <div class="poppins text-[2.4rem] font-bold text-text">
                    Project Report
                </div>
                <div class="poppins text-[1.8rem] text-text-sub/90">
                    One-Click, Comprehensive KPI PDF for Your Investors or Team.
                </div>
                <div v-if="activeProject" class="flex gap-2">
                    <div class="poppins text-[1.4rem] font-semibold text-text-sub/90">
                        Relative to:
                    </div>
                    <div class="poppins text-[1.4rem] font-semibold text-text">
                        {{ activeProject.name }}
                        <span class="text-[.9rem] text-text-sub/80"> ( {{ activeProject._id }} ) </span>
                    </div>
                </div>
            </div>

            <div>


                <div @click="generatePDF()"
                    class="flex flex-col rounded-xl overflow-hidden hover:shadow-[0_0_50px_#2969f1] hover:outline hover:outline-[2px] hover:outline-accent cursor-pointer">
                    <div class="h-[14rem] aspect-[9/7] bg-[#2f2a64] flex relative">
                        <img class="object-cover" :src="'/report/card_image.png'">

                        <div
                            class="absolute px-4 py-1 rounded-lg poppins left-2 flex gap-2 bottom-2 bg-orange-500/80 items-center">
                            <div class="flex items-center"> <i class="far fa-fire text-[1.1rem]"></i></div>
                            <div class="poppins text-[1rem] font-semibold"> Popular </div>
                        </div>

                    </div>
                    <div class="bg-[#444444cc] p-4 h-[7rem] relative">
                        <div class="poppins text-[1.2rem] font-bold text-text">
                            Generate
                        </div>
                        <div class="poppins text-[1rem] text-text-sub/90">
                            Create your report now
                        </div>
                        <div class="absolute right-4 bottom-3">
                            <i class="fas fa-arrow-right text-[1.2rem]"></i>
                        </div>
                    </div>
                </div>


            </div>




        </div>

    </div>

</template>
