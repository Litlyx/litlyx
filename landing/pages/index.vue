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

</script>


<template>

    <div class="home relative h-full w-full bg-lyx-background px-8 py-10 overflow-x-hidden">

        <div class="poppins font-medium text-[3rem] text-center leading-[3.5rem]">
            Analytics For
            <span class="text-lyx-primary"> Developers </span>
        </div>

        <div class="poppins text-center text-lyx-text-dark mt-4 text-[1.1rem]">
            30 Seconds Setup with One Line of Code.
            All Your Analytics in a Single AI Powered Dashboard.
        </div>


        <div class="flex justify-center mt-8">
            <LyxUiButton class="text-[1.2rem] px-6 py-2" type="primary"> Start for free </LyxUiButton>
        </div>

        <div class="mt-8">
            <img :src="'placeholder.jpg'" alt="Placeholder">
        </div>

        <div class="text-center poppins mt-8">
            Trusted by
            <NuxtLink class="font-bold" target="_blank" to="#">NuvolAI</NuxtLink>,
            <NuxtLink class="font-bold" target="_blank" to="#">DTech</NuxtLink>,
            <NuxtLink class="font-bold" target="_blank" to="#">National Geografic (IT)</NuxtLink>,
            <NuxtLink class="font-bold" target="_blank" to="#">DeckX</NuxtLink>,
            <NuxtLink class="font-bold" target="_blank" to="#">Antichi Casali Camper Shop</NuxtLink>,
            for Data collection.
        </div>


        <div class="poppins text-center font-semibold text-[1.8rem] mt-20">
            Collect Analytics, <br>Easy way
        </div>

        <div class="poppins text-center mt-4 text-[1.1rem]">
            More than 10 KPIs like Page Visits, Custom Events
            Referrers and many more
        </div>


        <div class="flex justify-center items-center gap-2 text-[.8rem] mt-8">
            <LyxUiButton type="secondary"> Javascript </LyxUiButton>
            <LyxUiButton type="secondary"> All js runtime </LyxUiButton>
            <LyxUiButton type="secondary"> Custom events </LyxUiButton>
        </div>

        <LyxUiCard class="w-full mt-8 bg-lyx-background py-6">
            <span class="text-[#9CDCFE] menlo text-[1.1rem]">Lit</span>
            <span class="text-[#D3D3D3] menlo text-[1.1rem]">.</span>
            <span class="text-[#DCDCAA] menlo text-[1.1rem]">init</span>
            <span class="text-[#D3D3D3] menlo text-[1.1rem]">(</span>
            <span class="text-[#CE9178] menlo text-[1.1rem]">'project_id'</span>
            <span class="text-[#D3D3D3] menlo text-[1.1rem]">);</span>
        </LyxUiCard>



        <div class="poppins text-center mt-4 text-[1.1rem]">
            That’s It! You are <span class="font-bold"> Ready </span> to Collect data.
        </div>

        <div class="flex justify-center mt-8">
            <LyxUiButton class="text-[1.2rem] px-6 py-2" type="primary"> Start for free </LyxUiButton>
        </div>






        <div class="poppins text-center font-semibold text-[1.8rem] mt-20">
            Plug in <br> Everywhere.
        </div>

        <div class="poppins text-center mt-4 text-[1.1rem]">
            Seamless Integrations with popular
            <span class="text-[#FFCA27]">JS</span>/<span class="text-[#017ACB]">TS</span>
            runtime like React, Angular, Vue, Node, Next and many more.
        </div>

        <div class="mt-8">
            <img :src="'techs-new.png'" alt="Techs">
        </div>





        <div class="poppins text-center font-semibold text-[1.8rem] mt-20">
            Connect DB'S In One Place with beautiful charts
        </div>

        <div class="poppins text-center mt-4 text-[1.1rem]">
            Easily connect all your databases to your dashboard like Supabase, MongoDB, Cassandra and more.
        </div>

        <div class="mt-10">
            <img :src="'db-connect.png'" alt="DB-CONNECT">
        </div>

        <div class="poppins text-center mt-10 text-[1.1rem]">
            We don't only collect Analytics.
            We Agglomerate your Existing data! Showing
            Beautiful Charts!
        </div>

        <div class="mt-8">
            <img :src="'placeholder.jpg'" alt="Placeholder">
        </div>


        <div class="flex justify-center mt-8">
            <LyxUiButton class="text-[1.2rem] px-10 py-2" type="outline">
                Go to Live Demo!
            </LyxUiButton>
        </div>


        <div class="poppins text-center font-semibold text-[1.8rem] mt-20">
            An AI Data Analyst Available 24/7
        </div>

        <div class="poppins text-center mt-4 text-[1.1rem]">
            Take metrics-driven decision with Lit our AI agent. Generate charts chatting with Lit. 
        </div>

        <div class="mt-8">
            <img :src="'ai-chat.png'" alt="Ai-Chat">
        </div>





        <div class="poppins text-center font-semibold text-[1.8rem] mt-20">
            Our Users Loves Litlyx Semplicity
        </div>




        
        <div class="poppins text-center font-semibold text-[1.8rem] mt-20">
            Powered by <br> Open-Source
        </div>

        <div class="poppins text-center mt-4 text-[1.1rem]">
            Completely self-hostable with Docker.
        </div>

        <div class="mt-8">
            <img :src="'selfhost.png'" alt="Self-Host">
        </div>

        <div class="flex justify-center flex-col gap-4 w-full items-center mt-20">
            <LyxUiButton class="text-[1.2rem] px-10 py-2" type="outline">
               Leave a Star on Github!
            </LyxUiButton>
            <LyxUiButton class="text-[1.2rem] px-10 py-2" type="primary">
               Start for free
            </LyxUiButton>
        </div>
      
    </div>

</template>

<style scoped lang="scss">
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