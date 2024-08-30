<script setup lang="ts">

definePageMeta({ layout: 'header' });

const autoscroll = ref<HTMLElement>();

const x = ref<number>();
const y = ref<number>();

let mouseMoveHandler: any;

onUnmounted(() => {
    document.removeEventListener('mousemove', mouseMoveHandler);
});

onMounted(() => {
    mouseMoveHandler = function (e: MouseEvent) {
        x.value = e.screenX;
        y.value = e.screenY;
    }
    document.addEventListener('mousemove', mouseMoveHandler);
});

const blobSize = 40 * 16;

const mouseStyle = computed(() => {
    if (!x.value) return;
    if (!y.value) return;
    return `top: ${y.value - (blobSize / 2)}px; left: ${x.value - (blobSize / 2)}px; width: ${blobSize}px; height: ${blobSize}px;`
});



const email = ref<string>("");

const scriptDeferTokens = ref<string[]>([
    "<",
    "script",
    " defer ",
    "data-project",
    "=",
    "\"project_id\"",
    " src",
    "=",
    "\"https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js\"",
    ">",
    "<",
    "/script",
    ">",
])

const snippetIndex = ref<number>(0);


async function saveEmail() {
    await fetch('https://savemail.litlyx.com/email/' + encodeURIComponent(email.value), {
        mode: 'no-cors'
    });
    email.value = '';
    alert('We will keep you updated');
}

</script>


<template>

    <div class="flex justify-center home relative">

        <div
            class="lg:w-[800px] h-full w-full bg-lyx-background px-8 py-10 overflow-x-hidden flex flex-col items-center">

            <div class="headline w-full scale-up-center">
                Analytics For
                <span class="text-lyx-primary"> Developers </span>
            </div>


            <div class="section !mt-6">

                <div class="paragraph">
                    30 Seconds Setup with One Line of Code.
                    All Your Analytics in a Single AI Powered Dashboard.
                </div>

                <div class="button-container gap-3 flex-col lg:flex-row items-center">
                    <LyxUiButton link="https://dashboard.litlyx.com" target="_blank" class="button" type="primary">
                        Start for free
                    </LyxUiButton>
                    <LyxUiButton link="https://dashboard.litlyx.com/live_demo" target="_blank" class="button"
                        type="outline">
                        Go to live demo
                    </LyxUiButton>
                </div>

            </div>

            <div class="mt-8">
                <img :src="'screenshot.png'" alt="Litlyx dashboard">
            </div>

            <div class="text-center poppins mt-8">
                Trusted by
                <NuxtLink class="font-bold" target="_blank" to="https://nuvol.ai">NuvolAI</NuxtLink>,
                <NuxtLink class="font-bold" target="_blank" to="https://www.nationalgeographic.it">National Geografic
                    (IT)</NuxtLink>,
                <NuxtLink class="font-bold" target="_blank" to="https://deckx.app">DeckX</NuxtLink>,
                <NuxtLink class="font-bold" target="_blank" to="https://www.antichicasalicampershop.it">Antichi Casali
                    Camper Shop</NuxtLink>,
                for Data collection.
            </div>


            <div class="section">

                <div class="subtitle">
                    Collect analytics, <br>easy way
                </div>

                <div class="paragraph">
                    More than 10 KPIs like Page Visits, Custom Events
                    Referrers and many more
                </div>


                <div class="flex justify-center items-center gap-2 text-[.8rem] mt-8">
                    <LyxUiButton :class="{ 'outline outline-[1px] outline-[#CD8700]': snippetIndex == 0 }"
                        @click="snippetIndex = 0" type="secondary"> Javascript
                    </LyxUiButton>
                    <LyxUiButton :class="{ 'outline outline-[1px] outline-[#CD8700]': snippetIndex == 1 }"
                        @click="snippetIndex = 1" type="secondary"> Runtimes </LyxUiButton>
                    <LyxUiButton :class="{ 'outline outline-[1px] outline-[#CD8700]': snippetIndex == 2 }"
                        @click="snippetIndex = 2" type="secondary"> Events </LyxUiButton>
                </div>


                <LyxUiCard class="w-full mt-8 bg-lyx-background py-6 text-center">

                    <div v-if="snippetIndex == 0" class="text-[.9rem]">
                        <span class="text-[#808080] menlo">{{ scriptDeferTokens[0] }}</span>
                        <span class="text-[#569CD6] menlo">{{ scriptDeferTokens[1] }}</span>
                        <span class="text-[#9CDCFE] menlo">{{ scriptDeferTokens[2] }}</span>
                        <span class="text-[#9CDCFE] text-nowrap menlo">{{ scriptDeferTokens[3] }}</span>
                        <span class="text-[#D4D4D4] menlo">{{ scriptDeferTokens[4] }}</span>
                        <span class="text-[#CD9178] menlo">{{ scriptDeferTokens[5] }}</span>
                        <span class="text-[#9CDCFE] menlo">{{ scriptDeferTokens[6] }}</span>
                        <span class="text-[#D4D4D4] menlo">{{ scriptDeferTokens[7] }}</span>
                        <span class="text-[#CE9178] break-words menlo">{{ scriptDeferTokens[8] }}</span>
                        <span class="text-[#808080] menlo">{{ scriptDeferTokens[9] }}</span>
                        <span class="text-[#808080] menlo">{{ scriptDeferTokens[10] }}</span>
                        <span class="text-[#569CD6] menlo">{{ scriptDeferTokens[11] }}</span>
                        <span class="text-[#808080] menlo">{{ scriptDeferTokens[12] }}</span>
                    </div>

                    <div v-if="snippetIndex == 1" class="text-[.9rem]">
                        <span class="text-[#9CDCFE] menlo">Lit</span>
                        <span class="text-[#D3D3D3] menlo">.</span>
                        <span class="text-[#DCDCAA] menlo">init</span>
                        <span class="text-[#D3D3D3] menlo">(</span>
                        <span class="text-[#CE9178] menlo">'project_id'</span>
                        <span class="text-[#D3D3D3] menlo">);</span>
                    </div>

                    <div v-if="snippetIndex == 2" class="text-[.9rem]">
                        <span class="text-[#9CDCFE] menlo">Lit</span>
                        <span class="text-[#D3D3D3] menlo">.</span>
                        <span class="text-[#DCDCAA] menlo">event</span>
                        <span class="text-[#D3D3D3] menlo">(</span>
                        <span class="text-[#CE9178] menlo">'event_name'</span>
                        <span class="text-[#D3D3D3] menlo">);</span>
                    </div>

                </LyxUiCard>



                <div class="poppins text-center mt-6 text-[1.1rem]">
                    That’s It! You are <span class="font-bold"> Ready </span> to Collect data.
                </div>

                <div class="button-container">
                    <LyxUiButton link="https://dashboard.litlyx.com" target="_blank" class="button" type="primary">
                        Start for free
                    </LyxUiButton>
                </div>

            </div>




            <div class="section">
                <div class="subtitle">
                    Plug in <br> everywhere.
                </div>

                <div class="paragraph">
                    Seamless Integrations with popular
                    <span class="text-[#FFCA27]">JS</span>/<span class="text-[#017ACB]">TS</span>
                    runtimes like Nuxt, Deno, Next, Vue, React and many more.
                </div>

                <div class="mt-8 flex justify-center">
                    <img :src="'techs-new.png'" alt="Techs">
                </div>
            </div>

            
            <LyxUiCard class="section w-full p-8">
                <div class="subtitle">
                    Why choose Litlyx
                </div>

                <div class="paragraph">
                    Litlyx vs Plausible vs Google Analytics
                </div>

                <div class="button-container">
                    <LyxUiButton link="/why-choose-litlyx" target="_blank" class="button" type="outline">
                        Read more
                    </LyxUiButton>
                </div>
            </LyxUiCard>



            <div class="section">

                <div class="subtitle">
                    Transform DB's data in beautiful charts
                </div>

                <div class="paragraph">
                    Easily connect all your databases to your dashboard like Supabase, MongoDB, Cassandra and more.
                </div>

                <div class="my-10 flex justify-center">
                    <img class="lg:h-[35rem]" :src="'db-connect.png'" alt="DB-CONNECT">
                </div>

                <div class="paragraph">
                    We don't only collect Analytics.
                    We Agglomerate your Existing data! Showing
                    Beautiful Charts!
                </div>

                <div class="mt-8 flex justify-center">
                    <img :src="'placeholder.jpg'" alt="Placeholder">
                </div>


                <div class="button-container">
                    <LyxUiButton link="https://dashboard.litlyx.com/live_demo" target="_blank" class="button"
                        type="outline">
                        Go to live demo
                    </LyxUiButton>
                </div>
            </div>


            <div class="section">

                <div class="subtitle">
                    An AI data analyst available 24/7
                </div>

                <div class="paragraph">
                    Take metrics-driven decision with Lit our AI agent. Generate charts chatting with Lit. 
                </div>

                <div class="mt-8 flex justify-center">
                    <img class="scale-125 lg:scale-100 lg:h-[35rem]" :src="'ai-chat.png'" alt="Ai-Chat">
                </div>

                <div class="button-container">
                    <LyxUiButton link="https://dashboard.litlyx.com" target="_blank" class="button" type="primary">
                        Start for free
                    </LyxUiButton>
                </div>

            </div>

            <div class="section">


                <div class="subtitle">
                    Our users loves Litlyx's simplicity
                </div>

                <ClientOnly>
                    <div class="mt-10 flex flex-col gap-4 lg:grid lg:grid-cols-2">
                        <Testimonial class="w-full h-full" name="Victoria - CEO" sub="Founder" link-text="@DeckX"
                            link="https://deckx.app"
                            text="Just one word: WOW! Easy to use. If I need to check my metrics, I open Litlyx. I love it.">
                        </Testimonial>
                        <Testimonial class="w-full h-full" name="Alessio - CEO" sub="Founder" link-text="@NuvolAI"
                            link="https://nuvol.ai"
                            text="I instantly loved Litlyx because it is simple. I integrated their universal script in PHP; it was seamless. I will start to track events very soon!
                            One of my clients said to me, 'We open only Litlyx to keep an eye on referrers from our campaigns.">
                        </Testimonial>
                        <Testimonial class="w-full h-full" name="Liam - Business Owner" sub=""
                            link-text="@Antichi Casali Camper Shop" link="https://www.antichicasalicampershop.it"
                            text="We needed to track metrics, but we didn’t know what to use. Than Alessio presented us Litlyx. We was Enthusiasts and paid the 9,99 subscription. We are happy about the service they provide for our online Ecommerce selling Camper equipments.">
                        </Testimonial>

                    </div>
                </ClientOnly>

            </div>

            <div class="section">
                <div class="subtitle">
                    Powered by <br> open-source
                </div>

                <div class="paragraph">
                    Completely self-hostable with Docker.
                </div>

                <div class="mt-8 flex justify-center">
                    <img class="w-[40%]" :src="'docker.png'" alt="Self-Host">
                </div>

                <div class="button-container flex-col items-center gap-4 !mt-10">
                    <LyxUiButton link="https://github.com/Litlyx/litlyx" target="_blank" class="button"
                        type="secondary">
                        Leave a Star on Github!
                    </LyxUiButton>
                </div>

            </div>


            <div class="section">
                <div class="subtitle">
                    Update me!
                </div>

                <div class="paragraph">
                    Litlyx is in beta version. We will keep you updated with our latest news.
                </div>

                <div class="flex justify-center mt-8">
                    <LyxUiInput placeholder="Insert email" v-model="email" class="text-[1.1rem] w-full py-2 px-3">
                    </LyxUiInput>
                </div>

                <div class="button-container">
                    <LyxUiButton class="button" type="primary" @click="saveEmail()">
                        Keep me updated
                    </LyxUiButton>
                </div>

            </div>

        </div>
    </div>

</template>

<style scoped lang="scss">
.section {
    @apply mt-20
}

.button {
    @apply font-medium text-[1rem] px-6 py-2
}

.button-container {
    @apply flex justify-center mt-8
}

.headline {
    font-family: 'Poppins' !important;
    @apply font-semibold text-[3rem] text-center leading-[3.5rem]
}

.paragraph {
    font-family: 'Poppins' !important;
    @apply text-center text-lyx-text-dark mt-4 text-[1.1rem]
}

.subtitle {
    font-family: 'Poppins' !important;
    @apply text-center font-semibold text-[1.8rem]
}

@media (min-width: 1024px) {
    .headline {
        @apply text-[4rem]
    }

    .subtitle {
        @apply text-[2.3rem]
    }

    .paragraph {
        @apply text-[1.5rem]
    }

    .section {
        @apply mt-32
    }
}




.footer * {
    font-family: "Poppins";
}

.footer {
    border-style: dashed !important;
}


.blob {
    width: 100%;
    height: 100%;
    border-radius: 13rem;
    background: linear-gradient(197.37deg, #7450DB -0.38%, rgba(138, 234, 240, 0) 101.89%), linear-gradient(115.93deg, #3E88F6 4.86%, rgba(62, 180, 246, 0.33) 38.05%, rgba(62, 235, 246, 0) 74.14%), radial-gradient(56.47% 76.87% at 6.92% 7.55%, rgba(62, 136, 246, 0.7) 0%, rgba(62, 158, 246, 0.182) 52.16%, rgba(62, 246, 246, 0) 100%), linear-gradient(306.53deg, #2EE4E3 19.83%, rgba(46, 228, 227, 0) 97.33%);
    background-blend-mode: normal, normal, normal, normal, normal, normal;
    filter: blur(100px);
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