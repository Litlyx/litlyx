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

        <div class="text-white items-center py-4 gap-2 flex-col lg:flex-row lg:mx-20 lg:pl-10 hidden lg:flex">


            <NuxtLink to="/" tag="div" class="flex gap-4 items-center">
                <div class="bg-[#2969f1] h-[2.8rem] aspect-[1/1] flex items-center justify-center rounded-lg">
                    <img class="h-[1.8rem]" :src="'/logo.png'">
                </div>
                <div class="font-semibold text-[1.6rem] text-gray-300 poppins">
                    Litlyx
                </div>
            </NuxtLink>

            <div class="grow"></div>
            <div class="flex gap-8 text-[1rem] text-white font-[500] poppins">
                <NuxtLink target="_blank" to="https://dashboard.litlyx.com/live_demo" class="hover:text-text-sub/90">
                    Live demo </NuxtLink>
                <NuxtLink target="_blank" to="https://docs.litlyx.com" class="hover:text-text-sub/90"> Docs </NuxtLink>
                <NuxtLink to="/pricing" class="hover:text-text-sub/90"> Pricing </NuxtLink>
                <NuxtLink target="_blank" to="https://github.com/Litlyx/litlyx"
                    class="hover:text-text-sub/90"> GitHub </NuxtLink>
            </div>
            <div class="px-10 pt-6 lg:pt-0">
                <NuxtLink to="https://dashboard.litlyx.com" target="_blank"
                    class="poppins font-[500] px-4 py-[.3rem] bg-accent rounded-xl">
                    Get started
                </NuxtLink>
            </div>
        </div>

        <div class="flex lg:hidden p-4">
            <NuxtLink to="/" class="flex gap-4 items-center">
                <div class="bg-[#2969f1] h-[2.8rem] aspect-[1/1] flex items-center justify-center rounded-lg">
                    <img class="h-[1.8rem]" :src="'/logo.png'">
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
            <div v-if="isMenuOpen" class="menu fixed z-[20] top-20 left-0 w-full bg-bg h-dvh lg:hidden">
                <div class="flex flex-col p-4">

                    <div class="flex flex-col gap-4">
                        <NuxtLink to="https://dashboard.litlyx.com" target="_blank"
                            class="poppins font-semibold px-4 py-3 text-center bg-accent rounded-lg">
                            Get started
                        </NuxtLink>

                        <NuxtLink to="https://dashboard.litlyx.com/live_demo" target="_blank"
                            class="poppins font-semibold px-4 mb-6 py-3 text-center bg-[#e4e6f7] text-accent rounded-lg">
                            Live demo
                        </NuxtLink>
                    </div>

                    <!-- <div class="flex justify-between items-center mr-2">
                        <NuxtLink to="/" class="hover:text-text-sub/90 py-3"> Live demo </NuxtLink>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </div>
                    <div class="divider border-b border-gray-500/40"></div> -->

                    <div class="flex justify-between items-center mr-2">
                        <NuxtLink target="_blank" to="https://docs.litlyx.com" class="hover:text-text-sub/90 py-3">
                            Docs
                        </NuxtLink>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </div>

                    <div class="divider border-b border-gray-500/40"></div>

                    <div class="flex justify-between items-center mr-2">
                        <NuxtLink @click="isMenuOpen = false" to="/pricing" class="hover:text-text-sub/90 py-3"> Pricing
                        </NuxtLink>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </div>

                    <div class="divider border-b border-gray-500/40"></div>

                    <div class="flex justify-between items-center mr-2">
                        <NuxtLink target="_blank" to="https://github.com/Litlyx/litlyx"
                            class="hover:text-text-sub/90 py-3"> GitHub </NuxtLink>
                        <div> <i class="fas fa-chevron-right"></i> </div>
                    </div>

                    <div class="divider border-b border-gray-500/40"></div>

                </div>
            </div>
            <div>
                <slot></slot>

            </div>

            <div class="flex justify-center text-[1.3rem] items-center poppins py-16">
                Made with ❤ in Italy
            </div>

            <div
                class="border-t-[1px] border-accent/40 flex h-fit py-12 w-full justify-between footer flex-col lg:flex-row lg:px-[8rem]">

                <div class="flex flex-row lg:flex-col gap-7 justify-center mb-10 lg:mb-0">

                    <div class="flex items-center gap-2">
                        <div class="poppins font-bold text-[1.6rem] text-text/90">
                            Litlyx
                        </div>
                    </div>

                    <div class="flex gap-6 text-[1.5rem] text-text-sub/80">
                        <!-- <div> <i class="fab fa-x-twitter"></i> </div> -->
                        <div> <a href="https://www.linkedin.com/company/litlyx" target="_blank"> <i class="fab fa-linkedin"></i>
                            </a></div>
                    </div>

                    <div class="hidden lg:flex">
                        <div class="text-[.9rem] text-text-sub/80">
                            © 2024 Litlyx All right reserved.
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
</style>
