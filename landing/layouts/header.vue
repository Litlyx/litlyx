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
            <div class="flex gap-8 text-[1.1rem] text-white font-[500] items-center">
                <NuxtLink to="https://litlyx.com/blog" class="poppins hover:text-text-sub/90">
                    Blog
                </NuxtLink>
                <NuxtLink target="_blank" to="https://dashboard.litlyx.com/live_demo"
                    class="poppins hover:text-text-sub/90">
                    Live demo
                </NuxtLink>
                <NuxtLink target="_blank" to="https://docs.litlyx.com" class="poppins hover:text-text-sub/90">
                    Docs
                </NuxtLink>
                <!-- <NuxtLink target="_blank" to="https://github.com/Litlyx/litlyx" class="poppins hover:text-text-sub/90">
                    GitHub
                </NuxtLink> -->
                <NuxtLink to="/pricing" class="poppins hover:text-text-sub/90">
                    Pricing
                </NuxtLink>

                <NuxtLink to="https://github.com/Litlyx/litlyx"
                    class="cursor-pointer hover:bg-white/10 flex items-center gap-2 rounded-lg outline outline-[1px] outline-white px-6 py-[.3rem]">
                    <div class="w-6 h-6">
                        <svg viewBox="0 0 100 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M50.0002 0.000488281C22.3894 0.000488281 0 22.386 0 50.0007C0 72.0924 14.3266 90.8345 34.1933 97.4461C36.692 97.9088 37.6096 96.3614 37.6096 95.0406C37.6096 93.8485 37.563 89.9095 37.5418 85.7316C23.6313 88.7562 20.6961 79.8322 20.6961 79.8322C18.4217 74.0528 15.1446 72.5163 15.1446 72.5163C10.6083 69.4129 15.4865 69.4765 15.4865 69.4765C20.5075 69.8294 23.1513 74.6292 23.1513 74.6292C27.6108 82.2733 34.8482 80.0631 37.7014 78.7859C38.15 75.5539 39.4461 73.3485 40.8758 72.0999C29.7703 70.8352 18.0954 66.5479 18.0954 47.3894C18.0954 41.9308 20.0487 37.4701 23.2474 33.9687C22.7282 32.7091 21.0169 27.6238 23.7317 20.7366C23.7317 20.7366 27.9304 19.3927 37.4853 25.8619C41.4734 24.7537 45.7509 24.1985 50.0002 24.1796C54.2495 24.1985 58.5301 24.7537 62.526 25.8619C72.0696 19.3927 76.2624 20.7366 76.2624 20.7366C78.9839 27.6238 77.2718 32.7091 76.7526 33.9687C79.9584 37.4701 81.8983 41.9304 81.8983 47.3894C81.8983 66.5934 70.2014 70.8223 59.0677 72.0599C60.861 73.6116 62.459 76.6546 62.459 81.3192C62.459 88.0091 62.4009 93.3936 62.4009 95.0406C62.4009 96.3712 63.3009 97.9304 65.8357 97.4394C85.6915 90.8204 100 72.085 100 50.0007C100 22.386 77.6137 0.000488281 50.0002 0.000488281Z"
                                fill="white" />
                            <path
                                d="M18.7269 71.2268C18.6171 71.475 18.2257 71.5495 17.8701 71.3793C17.5073 71.2162 17.3034 70.8774 17.421 70.628C17.5289 70.3723 17.9202 70.3009 18.2822 70.4727C18.6457 70.6354 18.8528 70.9774 18.7269 71.2268ZM21.1864 73.4212C20.948 73.6424 20.4817 73.5396 20.1653 73.1902C19.8382 72.8416 19.777 72.3758 20.019 72.1511C20.2649 71.9303 20.717 72.0334 21.0448 72.3824C21.3719 72.735 21.4354 73.1981 21.186 73.4216L21.1864 73.4212ZM22.8738 76.229C22.5672 76.4419 22.066 76.2423 21.7566 75.7976C21.4503 75.3533 21.4503 74.82 21.7633 74.6063C22.0738 74.3925 22.5672 74.5847 22.8809 75.0259C23.1867 75.478 23.1867 76.0113 22.8734 76.2293L22.8738 76.229ZM25.727 79.481C25.4529 79.7829 24.8694 79.7022 24.442 79.2896C24.0051 78.8865 23.8832 78.3144 24.1581 78.012C24.4353 77.7093 25.0224 77.7944 25.4529 78.2034C25.887 78.6057 26.0196 79.1822 25.7274 79.481H25.727ZM29.4148 80.579C29.2944 80.9704 28.732 81.1484 28.1658 80.9821C27.6003 80.8108 27.2301 80.3519 27.3442 79.9563C27.4619 79.5622 28.0266 79.3767 28.5971 79.5547C29.1618 79.7253 29.5328 80.1806 29.4152 80.579H29.4148ZM33.6123 81.0445C33.6264 81.457 33.146 81.799 32.5515 81.8064C31.9535 81.8194 31.47 81.4856 31.4637 81.0802C31.4637 80.6637 31.9331 80.3249 32.5307 80.3151C33.1252 80.3033 33.6123 80.6347 33.6123 81.0445ZM37.7353 80.8864C37.8066 81.2888 37.3933 81.7021 36.8031 81.8119C36.2228 81.9178 35.6855 81.6695 35.6114 81.2707C35.5393 80.8582 35.9604 80.4453 36.5396 80.3382C37.131 80.2355 37.66 80.4774 37.7353 80.8864Z"
                                fill="white" />
                        </svg>
                    </div>
                    <div class="text-[1rem]">
                        210+
                    </div>
                </NuxtLink>

            </div>
            <div class="px-10 pt-6 lg:pt-0">


                <MainButton link="https://dashboard.litlyx.com">
                    Get started
                </MainButton>


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


                    <NuxtLink to="https://litlyx.com/blog" class="flex justify-between items-center mr-2">
                        <div class="hover:text-text-sub/90 py-3">
                            Blog
                        </div>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </NuxtLink>

                    <div class="divider border-b border-gray-500/40"></div>

                    <NuxtLink target="_blank" to="https://docs.litlyx.com"
                        class="flex justify-between items-center mr-2">
                        <div class="hover:text-text-sub/90 py-3">
                            Docs
                        </div>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </NuxtLink>

                    <div class="divider border-b border-gray-500/40"></div>

                    <div class="divider border-b border-gray-500/40"></div>


                    <NuxtLink @click="isMenuOpen = false" to="/pricing" class="flex justify-between items-center mr-2">
                        <div class="hover:text-text-sub/90 py-3">
                            Pricing
                        </div>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </NuxtLink>


                    <div class="divider border-b border-gray-500/40"></div>


                    <NuxtLink to="https://github.com/Litlyx/litlyx"
                        class="cursor-pointer hover:bg-white/10 mt-10 flex justify-center items-center gap-2 rounded-lg outline outline-[1px] outline-white px-6 py-3">
                        <div class="w-6 h-6">
                            <svg viewBox="0 0 100 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M50.0002 0.000488281C22.3894 0.000488281 0 22.386 0 50.0007C0 72.0924 14.3266 90.8345 34.1933 97.4461C36.692 97.9088 37.6096 96.3614 37.6096 95.0406C37.6096 93.8485 37.563 89.9095 37.5418 85.7316C23.6313 88.7562 20.6961 79.8322 20.6961 79.8322C18.4217 74.0528 15.1446 72.5163 15.1446 72.5163C10.6083 69.4129 15.4865 69.4765 15.4865 69.4765C20.5075 69.8294 23.1513 74.6292 23.1513 74.6292C27.6108 82.2733 34.8482 80.0631 37.7014 78.7859C38.15 75.5539 39.4461 73.3485 40.8758 72.0999C29.7703 70.8352 18.0954 66.5479 18.0954 47.3894C18.0954 41.9308 20.0487 37.4701 23.2474 33.9687C22.7282 32.7091 21.0169 27.6238 23.7317 20.7366C23.7317 20.7366 27.9304 19.3927 37.4853 25.8619C41.4734 24.7537 45.7509 24.1985 50.0002 24.1796C54.2495 24.1985 58.5301 24.7537 62.526 25.8619C72.0696 19.3927 76.2624 20.7366 76.2624 20.7366C78.9839 27.6238 77.2718 32.7091 76.7526 33.9687C79.9584 37.4701 81.8983 41.9304 81.8983 47.3894C81.8983 66.5934 70.2014 70.8223 59.0677 72.0599C60.861 73.6116 62.459 76.6546 62.459 81.3192C62.459 88.0091 62.4009 93.3936 62.4009 95.0406C62.4009 96.3712 63.3009 97.9304 65.8357 97.4394C85.6915 90.8204 100 72.085 100 50.0007C100 22.386 77.6137 0.000488281 50.0002 0.000488281Z"
                                    fill="white" />
                                <path
                                    d="M18.7269 71.2268C18.6171 71.475 18.2257 71.5495 17.8701 71.3793C17.5073 71.2162 17.3034 70.8774 17.421 70.628C17.5289 70.3723 17.9202 70.3009 18.2822 70.4727C18.6457 70.6354 18.8528 70.9774 18.7269 71.2268ZM21.1864 73.4212C20.948 73.6424 20.4817 73.5396 20.1653 73.1902C19.8382 72.8416 19.777 72.3758 20.019 72.1511C20.2649 71.9303 20.717 72.0334 21.0448 72.3824C21.3719 72.735 21.4354 73.1981 21.186 73.4216L21.1864 73.4212ZM22.8738 76.229C22.5672 76.4419 22.066 76.2423 21.7566 75.7976C21.4503 75.3533 21.4503 74.82 21.7633 74.6063C22.0738 74.3925 22.5672 74.5847 22.8809 75.0259C23.1867 75.478 23.1867 76.0113 22.8734 76.2293L22.8738 76.229ZM25.727 79.481C25.4529 79.7829 24.8694 79.7022 24.442 79.2896C24.0051 78.8865 23.8832 78.3144 24.1581 78.012C24.4353 77.7093 25.0224 77.7944 25.4529 78.2034C25.887 78.6057 26.0196 79.1822 25.7274 79.481H25.727ZM29.4148 80.579C29.2944 80.9704 28.732 81.1484 28.1658 80.9821C27.6003 80.8108 27.2301 80.3519 27.3442 79.9563C27.4619 79.5622 28.0266 79.3767 28.5971 79.5547C29.1618 79.7253 29.5328 80.1806 29.4152 80.579H29.4148ZM33.6123 81.0445C33.6264 81.457 33.146 81.799 32.5515 81.8064C31.9535 81.8194 31.47 81.4856 31.4637 81.0802C31.4637 80.6637 31.9331 80.3249 32.5307 80.3151C33.1252 80.3033 33.6123 80.6347 33.6123 81.0445ZM37.7353 80.8864C37.8066 81.2888 37.3933 81.7021 36.8031 81.8119C36.2228 81.9178 35.6855 81.6695 35.6114 81.2707C35.5393 80.8582 35.9604 80.4453 36.5396 80.3382C37.131 80.2355 37.66 80.4774 37.7353 80.8864Z"
                                    fill="white" />
                            </svg>
                        </div>
                        <div class="text-[1rem]">
                            210+
                        </div>
                        <div class="ml-2">
                            Star us on GitHub
                        </div>
                    </NuxtLink>

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

                        <NuxtLink to="/blog" class="hover:text-accent cursor-pointer"> Blog </NuxtLink>
                        <NuxtLink target="_blank" to="https://docs.litlyx.com" class="hover:text-accent cursor-pointer">
                            Docs </NuxtLink>
                        <NuxtLink target="_blank" to="https://github.com/Litlyx/litlyx"
                            class="hover:text-accent cursor-pointer"> Github </NuxtLink>
                        <NuxtLink to="/pricing" class="hover:text-accent cursor-pointer"> Pricing </NuxtLink>
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
