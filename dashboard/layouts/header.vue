<script setup lang="ts">

const route = useRoute()

const entries = [
    {
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/',
    },
    {
        label: 'Pricing',
        icon: 'i-heroicons-currency-dollar',
        to: '/pricing'
    },
    {
        label: 'FAQ',
        icon: 'i-heroicons-question-mark-circle',
        to: '/faq'
    }
]

const loggedUser = useLoggedUser();
const { setToken } = useAccessToken();

</script>


<template>

    <div class="layout h-full flex flex-col pt-1 px-1">

        <div class="text-white flex items-center py-4 pl-10 gap-2 mx-20">


            <div class="flex gap-4 items-center">
                <div class="bg-[#2969f1] h-[2.8rem] aspect-[1/1] flex items-center justify-center rounded-lg">
                    <img class="h-[1.8rem]" :src="'/logo.png'">
                </div>
                <div class="font-bold text-[1.6rem] text-gray-300 poppins"> Litlyx </div>
            </div>
            <!-- <div class="flex items-center gap-4">
                <div class="w-8 h-8 bg-blue-400"></div>
                <div class="font-bold text-[1.2rem] poppins"> Litlyx </div>
            </div> -->

            <div class="grow"></div>
            <div class="flex gap-8 text-[1rem] text-white font-[500] poppins">
                <div> Open metrics </div>
                <div> Docs </div>
                <div> Pricing </div>
                <div> GitHub </div>
                <div> FAQ </div>
            </div>
            <div class="px-10">
                <div class="poppins font-[500] px-4 py-[.3rem] bg-accent rounded-xl"> Open App </div>
            </div>
        </div>

        <div class="overflow-y-auto shrink h-full">
            <div>
                <slot></slot>

            </div>

            <div class="flex justify-center text-[1.3rem] items-center poppins py-16">
                Made with ❤ in Italy
            </div>

            <div class="border-t-[1px] border-accent/40 flex h-fit py-12 w-full justify-between px-[8rem] footer">

                <div class="flex flex-col gap-7">

                    <div class="flex items-center gap-2">
                        <!-- <div class="flex items-center justify-center">
                        <img :src="'logo.png'" class="h-[1.5rem]">
                    </div> -->
                        <div class="poppins font-bold text-[1.6rem] text-text/90">
                            Litlyx
                        </div>
                    </div>

                    <div class="flex gap-6 text-[1.5rem] text-text-sub/80">
                        <div> <i class="fab fa-x-twitter"></i> </div>
                        <div> <i class="fab fa-linkedin"></i> </div>
                    </div>

                    <div>
                        <div class="text-[.9rem] text-text-sub/80"> © 2024 Epictech Development S.r.l. All right
                            reserved.
                        </div>
                    </div>

                </div>

                <div class="flex gap-20">

                    <div class="flex flex-col gap-4">
                        <div class="text-text-sub/60 font-semibold"> Product </div>
                        <div class="hover:text-accent cursor-pointer"> Pricing </div>
                        <div class="hover:text-accent cursor-pointer"> Docs </div>
                        <div class="hover:text-accent cursor-pointer"> Github </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="text-text-sub/60 font-semibold"> Company </div>
                        <div class="hover:text-accent cursor-pointer"> About </div>
                        <div class="hover:text-accent cursor-pointer"> Contact us </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="text-text-sub/60 font-semibold"> Legal </div>
                        <div class="hover:text-accent cursor-pointer"> Privacy policy </div>
                        <div class="hover:text-accent cursor-pointer"> Terms and conditions </div>
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
