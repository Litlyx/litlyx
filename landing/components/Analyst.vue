<script lang="ts" setup>

</script>

<template>
    <div class="relative w-[90%]">

        <div class="flex justify-center mt-20 z-[25] relative items-center flex-col gap-6">
            <div class="poppins text-center font-semibold text-[2.2rem] lg:text-[3rem] text-text">
                AI Analyst
            </div>
        </div>

        <div class="flex justify-center mx-auto w-[20rem] z-[25] relative">
            <img class="w-full h-full" alt="Litlyx AI Agent" :src="'agent.png'">
        </div>

        <div class="flex flex-col items-center justify-center gap-2 z-[25] relative">
            <div
                class="poppins font-semibold text-[1.5rem] lg:text-[1.85rem] z-[10] text-text-sub text-center w-[75%] lg:w-[40%]">
                Meet Lit! The Agent that help you analyze your data!
            </div>
            <div class="poppins text-[1.35rem] text-text-sub text-center z-[10] w-[90%] lg:w-[60%]">
                Take metrics-driven decision with the AI agent suggestions!
            </div>
        </div>
    </div>
</template>
