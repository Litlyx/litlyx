<script lang="ts" setup>

const { start, addToQueue, currentText } = useTextWriter();

onMounted(() => {
    addToQueue(`Lit.init("project_id");`);
    addToQueue(`Lit.event("your_event_name");`);

    start(60, 1500);
})

</script>

<template>
    <div class="flex flex-col gap-4 w-[90%]">

        <div class="flex flex-col items-center justify-center gap-2">
            <div
                class="poppins font-semibold z-[10] text-[2.2rem] lg:text-[3rem] text-text-sub text-center w-[75%] lg:w-[40%]">
                Collect Analytics, Easy way
            </div>
            <div class="poppins text-[1.35rem] text-text-sub text-center w-[90%] lg:w-[60%] z-[10]">
                Website Visits, Custom Events, Referrers, Browsers, Devices, Operating Systems (OS), Countries, Search Terms, Unique Users, Sessions, and many more.
            </div>
        </div>

        <div
            class="bg-menu font-semibold px-8 text-[1.2rem] md:text-[1.4rem] h-24 flex items-center inconsolata mt-12 outline outline-[2px] outline-[#83838388] rounded-lg">
            {{ currentText }}
        </div>

        <div class="flex justify-center mt-12 z-[20] relative">
            <div class="flex gap-6 items-center flex-col lg:flex-row">
                <NuxtLink to="https://dashboard.litlyx.com"
                    class="hover:bg-white/90 font-semibold cursor-pointer flex items-center gap-4 text-xl bg-text text-bg-light px-8 py-3 rounded-2xl text-black">
                    <div class="poppins"> Get Started for Free </div>
                    <i class="fas fa-arrow-right"></i>
                </NuxtLink>

                <!-- <NuxtLink target="_blank" to="https://dashboard.litlyx.com/live_demo"
                    class="hover:bg-accent/90 font-semibold cursor-pointer flex items-center gap-4 text-xl bg-accent text-bg-light px-16 py-3 rounded-2xl text-text">
                    <div class="poppins"> Live demo </div>
                </NuxtLink> -->
            </div>
        </div>




    </div>
</template>