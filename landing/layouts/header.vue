<script setup lang="ts">

const isMenuOpen = ref<boolean>(false);


const scroller = ref<any>(null);

const nuxtApp = useNuxtApp()

nuxtApp.hook("page:finish", () => {
    scroller.value?.scrollTo(0, 0);
})

</script>


<template>

    <div class="layout h-full flex flex-col pt-1 px-1">

        <div
            class="text-white items-center py-4 gap-2 flex-col lg:flex-row lg:mx-20 lg:pl-10 hidden lg:flex z-[20] relative">


            <NuxtLink to="/" tag="div" class="flex gap-4 items-center">
                <div class="bg-black h-[2.8rem] aspect-[1/1] flex items-center justify-center rounded-lg">
                    <img class="h-[1.8rem]" alt="Litlyx logo" :src="'/logo.png'">
                </div>
                <div class="font-semibold text-[1.6rem] text-gray-300 poppins">
                    Litlyx
                </div>
            </NuxtLink>

            <div class="grow"></div>
            <div class="flex gap-8 text-[1.1rem] text-white font-[500]">
                <NuxtLink target="_blank" to="https://dashboard.litlyx.com/live_demo"
                    class="poppins hover:text-text-sub/90">
                    Live demo
                </NuxtLink>
                <NuxtLink target="_blank" to="https://docs.litlyx.com" class="poppins hover:text-text-sub/90">
                    Docs
                </NuxtLink>
                <NuxtLink to="/pricing" class="poppins hover:text-text-sub/90">
                    Pricing
                </NuxtLink>
                <NuxtLink target="_blank" to="https://github.com/Litlyx/litlyx" class="poppins hover:text-text-sub/90">
                    GitHub
                </NuxtLink>
            </div>
            <div class="px-10 pt-6 lg:pt-0">
                <NuxtLink to="https://dashboard.litlyx.com" target="_blank"
                    class="poppins font-[500] px-10 py-[.3rem] bg-accent rounded-xl animated-button">
                    Get started
                </NuxtLink>
            </div>
        </div>

        <div class="flex lg:hidden p-4 z-[20] relative">
            <NuxtLink to="/" class="flex gap-4 items-center">
                <div class="bg-black h-[2.8rem] aspect-[1/1] flex items-center justify-center rounded-lg">
                    <img class="h-[1.8rem]" alt="Litlyx logo" :src="'/logo.png'">
                </div>
                <div class="font-bold text-[1.6rem] text-gray-300 poppins">
                    Litlyx
                </div>
            </NuxtLink>

            <div class="grow"></div>
            <div class="text-text-sub text-[1.5rem] flex items-center">
                <i @click="isMenuOpen = !isMenuOpen" class="fas fa-bars" :class="{ 'fa-times': isMenuOpen }"></i>
            </div>

        </div>


        <div ref="scroller" :class="{ 'overflow-y-hidden': isMenuOpen }" class="overflow-y-auto shrink h-full relative">
            <div v-if="isMenuOpen" class="menu fixed z-[30] top-20 left-0 w-full bg-bg h-dvh lg:hidden">
                <div class="flex flex-col p-4">

                    <div class="flex flex-col gap-4">
                        <NuxtLink to="https://dashboard.litlyx.com" target="_blank"
                            class="animated-button poppins font-semibold px-4 py-3 text-center bg-black rounded-lg">
                            Get started for free
                        </NuxtLink>

                        <NuxtLink to="https://dashboard.litlyx.com/live_demo" target="_blank"
                            class="poppins font-semibold px-4 mb-6 py-3 text-center bg-transparent border-solid border-[1px] border-white/80 text-white rounded-lg">
                            Live demo
                        </NuxtLink>
                    </div>


                    <NuxtLink target="_blank" to="https://docs.litlyx.com"
                        class="flex justify-between items-center mr-2">
                        <div class="hover:text-text-sub/90 py-3">
                            Docs
                        </div>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </NuxtLink>

                    <div class="divider border-b border-gray-500/40"></div>

                    <NuxtLink @click="isMenuOpen = false" to="/pricing" class="flex justify-between items-center mr-2">
                        <div class="hover:text-text-sub/90 py-3">
                            Pricing
                        </div>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </NuxtLink>

                    <div class="divider border-b border-gray-500/40"></div>

                    <NuxtLink target="_blank" to="https://github.com/Litlyx/litlyx"
                        class="flex justify-between items-center mr-2">
                        <div class="hover:text-text-sub/90 py-3"> GitHub </div>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </NuxtLink>

                    <div class="divider border-b border-gray-500/40"></div>

                </div>
            </div>
            <div>
                <slot></slot>

            </div>


            <div
                class="border-t-[1px] border-accent/40 mt-20 flex h-fit py-12 w-full justify-between footer flex-col lg:flex-row lg:px-[8rem] relative z-[20]">

                <div class="flex items-center lg:items-start flex-col gap-7 justify-center mb-10 lg:mb-0">

                    <div class="flex items-center gap-2">
                        <div class="poppins font-bold text-[1.6rem] text-text/90">
                            Litlyx
                        </div>
                    </div>

                    <div class="flex gap-6 text-[1.6rem] text-text-sub/80">
                        <!-- <div> <i class="fab fa-x-twitter"></i> </div> -->
                        <div class="flex gap-4">
                            <a class="hover:text-gray-400" href="https://www.linkedin.com/company/litlyx"
                                target="_blank">
                                <i class="fab fa-linkedin"></i>
                            </a>
                            <a class="hover:text-gray-400" href="https://www.github.com/Litlyx/litlyx" target="_blank">
                                <i class="fab fa-github"></i>
                            </a>
                        </div>
                    </div>

                    <div class="flex">
                        <div class="text-[.9rem] flex flex-col lg:items-start text-center text-text-sub/80">
                            <div> © 2024 Litlyx All right reserved. </div>
                            <div class="ml-1 font-bold">Made with ❤ in Italy </div>
                        </div>
                    </div>

                </div>

                <div class="flex gap-6 lg:gap-20 flex-col lg:flex-row text-center lg:text-start">

                    <div class="flex flex-col gap-4">

                        <div class="text-text-sub/60 font-semibold text-[1.3rem]"> Product </div>

                        <NuxtLink to="/pricing" class="hover:text-accent cursor-pointer"> Pricing </NuxtLink>
                        <NuxtLink target="_blank" to="https://docs.litlyx.com" class="hover:text-accent cursor-pointer">
                            Docs </NuxtLink>
                        <NuxtLink target="_blank" to="https://github.com/Litlyx/litlyx"
                            class="hover:text-accent cursor-pointer"> Github </NuxtLink>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="text-text-sub/60 font-semibold text-[1.3rem]"> Company </div>
                        <!-- <NuxtLink to="/" class="hover:text-accent cursor-pointer"> About </NuxtLink> -->
                        <NuxtLink to="/contacts" class="hover:text-accent cursor-pointer"> Contacts </NuxtLink>
                    </div>
                    <div class="flex-col flex gap-4 text-center lg:text-start">
                        <div class="text-text-sub/60 font-semibold text-[1.3rem]"> Legal </div>
                        <NuxtLink to="/privacy" class="hover:text-accent cursor-pointer"> Privacy </NuxtLink>
                        <NuxtLink to="/terms" class="hover:text-accent cursor-pointer"> Terms </NuxtLink>
                        <NuxtLink to="/data_policy" class="hover:text-accent cursor-pointer"> Data policy </NuxtLink>
                    </div>

                </div>

            </div>

        </div>


    </div>

</template>

<style scoped lang="scss">
.banner * {
    font-family: "Nunito";
}

.layout * {
    font-family: "Inter";
}






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
