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
                Website Visits, Custom Events, Referrers, Browsers, Devices, Operating Systems (OS), Countries, Search
                Terms, Unique Users, Sessions, and many more.
            </div>
        </div>

        <div
            class="bg-menu font-semibold px-8 text-[1.2rem] md:text-[1.4rem] h-24 flex items-center inconsolata mt-12 outline outline-[2px] outline-[#83838388] rounded-lg">
            {{ currentText }}
        </div>

        <div class="flex justify-center mt-12 z-[20] relative">
            <div class="flex gap-6 items-center flex-col lg:flex-row">
                <NuxtLink to="https://dashboard.litlyx.com"
                    class="hover:bg-white/90 font-semibold cursor-pointer flex items-center gap-4 text-xl animated-button px-8 py-3 rounded-2xl">
                    <div class="flex gap-4 items-center">
                        <div class="poppins"> Get Started for Free </div>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </NuxtLink>

            </div>
        </div>




    </div>
</template>

<style scoped lang="scss">
.animated-button {
    display: grid;
    place-content: center;
    color: white;
    text-shadow: 0 1px 0 #000;
    width: 100%;

    --border-angle: 0turn; // For animation.

    --main-bg: conic-gradient(from var(--border-angle),
            rgb(17, 20, 51),
            rgb(17, 18, 34) 5%,
            rgb(17, 20, 34) 60%,
            rgb(17, 28, 51) 95%);


    border: solid 2px transparent;
    --gradient-border: conic-gradient(from var(--border-angle),
            transparent 25%,
            rgb(0, 136, 255),
            transparent 99%,
            transparent);

    background:
        // padding-box clip this background in to the overall element except the border.
        var(--main-bg) padding-box,
        // border-box extends this background to the border space
        var(--gradient-border) border-box,
        // Duplicate main background to fill in behind the gradient border. You can remove this if you want the border to extend "outside" the box background.
        var(--main-bg) border-box;

    background-position: center center;

    animation: bg-spin 3s linear infinite;

    @keyframes bg-spin {
        to {
            --border-angle: 1turn;
        }
    }

    &:hover {
        animation-play-state: paused;
    }
}

@property --border-angle {
    syntax: "<angle>";
    inherits: true;
    initial-value: 0turn;
}
</style>