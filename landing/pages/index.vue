<script setup lang="ts">

definePageMeta({ layout: 'header' });

const autoscroll = ref<HTMLElement>();

onMounted(() => {
    // setInterval(() => {
    //     if (!autoscroll.value) return;
    //     autoscroll.value.scrollLeft++;
    // }, 10);
})

</script>


<template>

    <div class="home relative h-full w-full bg-[#151517]">

        <div class="absolute top-0 left-0 w-full h-full flex flex-col items-center z-0 overflow-hidden">
            <HomeBgGrid :size="100" :spacing="18" opacity="0.3" class="w-fit h-fit"></HomeBgGrid>
            <HomeBgGrid :size="100" :spacing="18" opacity="0.2" class="w-fit h-fit"></HomeBgGrid>
        </div>


        <div class="flex w-full mt-20 justify-center relative z-[10]">
            <div class="flex flex-col items-center justify-center gap-20 rounded-lg py-6">

                <div class="poppins text-center font-bold text-text lg:leading-[5rem] text-[1.7rem] lg:text-[4rem]">
                    Boost Analytics Collection
                    <br>
                    with <span class="text-accent"> Minimal Setup </span>
                </div>

                <div class="flex gap-4 flex-col lg:flex-row lg:gap-10">

                    <div class="flex items-center gap-2">
                        <i class="fas fa-check text-[1.5rem]"></i>
                        <div class="poppins text-[1.2rem]"> One-Line Code Setup </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <i class="fas fa-check text-[1.5rem]"></i>
                        <div class="poppins text-[1.2rem]"> 15+ Techs Supported </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <i class="fas fa-check text-[1.5rem]"></i>
                        <div class="poppins text-[1.2rem]"> High customization </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <i class="fas fa-check text-[1.5rem]"></i>
                        <div class="poppins text-[1.2rem]"> GDPR Compliance </div>
                    </div>

                </div>

                <div class="flex gap-6 items-center flex-col lg:flex-row">
                    <NuxtLink to="https://dashboard.litlyx.com"
                        class="hover:bg-white/90 font-semibold cursor-pointer flex items-center gap-4 text-xl bg-text text-bg-light px-8 py-3 rounded-2xl text-black">
                        <div class="poppins"> Get started for free </div>
                        <i class="fas fa-arrow-right"></i>
                    </NuxtLink>

                    <NuxtLink target="_blank" to="https://dashboard.litlyx.com/live_demo"
                        class="hover:bg-accent/90 font-semibold cursor-pointer flex items-center gap-4 text-xl bg-accent text-bg-light px-16 py-3 rounded-2xl text-text">
                        <div class="poppins"> Live demo </div>
                    </NuxtLink>
                </div>

            </div>
        </div>

        <div class="flex justify-center mt-10 z-[10] relative">
            <div class="bg-[#1d1d1f] rounded-[1rem] overflow-hidden w-[96%] lg:w-[60%] ">
                <img :src="'screen_1.png'" class="">
            </div>
        </div>

        <div class="flex justify-center mt-20 z-[10] relative items-center flex-col gap-6">
            <div class="poppins font-bold text-text text-center text-[2.2rem] lg:text-[3rem]">
                +15 Supported technologies
            </div>
            <div class="poppins text-[1.2rem] text-text-sub text-center w-[90%] lg:w-[40%]">
                Seamless Integrations with popular JS/TS frameworks, including React, Angular, Vue, Node, Next and many
                more.
            </div>
            <div class="flex flex-wrap justify-center py-10 lg:gap-8 lg:px-20">
                <HomeTechCard name="Node.js" icon="tech/4.png"></HomeTechCard>
                <HomeTechCard name="React" icon="tech/15.png"></HomeTechCard>
                <HomeTechCard name="Vue.js" icon="tech/8.png"></HomeTechCard>
                <HomeTechCard name="Next.js" icon="tech/7.png"></HomeTechCard>
                <HomeTechCard name="Nuxt" icon="tech/12.png"></HomeTechCard>
                <HomeTechCard name="Angular" icon="tech/9.png"></HomeTechCard>
                <HomeTechCard name="Firebase" icon="tech/1.png"></HomeTechCard>
                <HomeTechCard name="NestJS" icon="tech/2.png"></HomeTechCard>
                <HomeTechCard name="Deno" icon="tech/11.png"></HomeTechCard>
                <HomeTechCard name="Lambda" icon="tech/14.png"></HomeTechCard>
                <HomeTechCard name="Fastify" icon="tech/5.png"></HomeTechCard>
                <HomeTechCard name="Netlify" icon="tech/13.png"></HomeTechCard>
                <HomeTechCard name="Bun" icon="tech/3.png"></HomeTechCard>
                <HomeTechCard name="Svelte" icon="tech/6.png"></HomeTechCard>
                <HomeTechCard name="Solid" icon="tech/10.png"></HomeTechCard>
            </div>
        </div>

        <div class="flex justify-center mt-20 z-[10] relative items-center flex-col gap-6">
            <div class="poppins font-bold text-[2.2rem] lg:text-[3rem] text-text">
                That's it !
            </div>
        </div>

        <div class="flex justify-center z-[10] relative">
            <img :src="'carbon_1.png'">
        </div>

        <div class="flex flex-col items-center justify-center gap-2">
            <div
                class="poppins font-semibold text-[1.5rem] z-[10] lg:text-[1.85rem] text-text-sub text-center w-[75%] lg:w-[40%]">
                This One-Line Code Collect 9 KPIs
            </div>
            <div class="poppins text-[1.35rem] text-text-sub text-center w-[90%] lg:w-[60%] z-[10]">
                Websites visits, Custom events, Referrers, Browsers, Devices, OS, Countries, SearchTerms, User Unique
                Session and more
            </div>
        </div>

        <div class="flex justify-center mt-20 z-[20] relative">
            <div class="flex gap-6 items-center flex-col lg:flex-row">
                <NuxtLink to="https://dashboard.litlyx.com"
                    class="hover:bg-white/90 font-semibold cursor-pointer flex items-center gap-4 text-xl bg-text text-bg-light px-8 py-3 rounded-2xl text-black">
                    <div class="poppins"> Get started for free </div>
                    <i class="fas fa-arrow-right"></i>
                </NuxtLink>

                <NuxtLink target="_blank" to="https://dashboard.litlyx.com/live_demo"
                    class="hover:bg-accent/90 font-semibold cursor-pointer flex items-center gap-4 text-xl bg-accent text-bg-light px-16 py-3 rounded-2xl text-text">
                    <div class="poppins"> Live demo </div>
                </NuxtLink>
            </div>
        </div>

        <!-- AI AGENT SECTION -->

        <div class="flex justify-center mt-20 z-[10] relative items-center flex-col gap-6">
            <div class="poppins font-bold text-[2.2rem] lg:text-[3rem] text-text">
                AI Analyst Integrated
            </div>
        </div>

        <div class="flex justify-center mx-auto w-[20rem] z-[10] relative">
            <img class="w-full h-full" :src="'agent.png'" >
        </div>

        <div class="flex flex-col items-center justify-center gap-2">
            <div
                class="poppins font-semibold text-[1.5rem] lg:text-[1.85rem] z-[10] text-text-sub text-center w-[75%] lg:w-[40%]">
                Meet Lit! The Agent that help you analyze your data!
            </div>
            <div class="poppins text-[1.35rem] text-text-sub text-center z-[10] w-[90%] lg:w-[60%]">
                Take metrics-driven decision with the AI agent suggestions!
            </div>
        </div>


        <div class="flex justify-center mt-20 z-[10] relative items-center flex-col gap-6">
            <div class="poppins font-bold text-[2.2rem] lg:text-[3rem] text-text"> Why use litlyx </div>
            <div ref="autoscroll"
                class="flex gap-8 flex-row lg:flex-col overflow-x-auto overflow-y-hidden lg:overflow-hidden w-full hide-scroll px-6">
                <div class="flex justify-center gap-8">
                    <HomeCard title="1-Minute Setup"
                        text="Effortlessly set up and start collecting KPIs in seconds."
                        icon="far fa-clock">
                    </HomeCard>
                    <HomeCard title="Real-time Insights"
                        text="Instantly visualize events and visits on your Project Dashboard."
                        icon="far fa-line-chart">
                    </HomeCard>
                    <HomeCard title="Custom events" text="Tailor your user experience tracking with custom events."
                        icon="far fa-tools">
                    </HomeCard>
                </div>
                <div class="flex justify-center gap-8">
                    <HomeCard title="Start for Free"
                        text="Try Litlyx with 3k FREE Visits & Events for your website."
                        icon="far fa-gift">
                    </HomeCard>
                    <HomeCard title="Open-Source"
                        text="Litlyx is transparent, Self-Hostable & Open-Source. Share same ❤️."
                        icon="far fa-globe">
                    </HomeCard>
                    <HomeCard title="Cost-Effective"
                        text="Get more for less with Litlyx, maximizing value without breaking the bank."
                        icon="far fa-wallet">
                    </HomeCard>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.footer * {
    font-family: "Poppins";
}

.footer {
    border-style: dashed !important;
}
</style>