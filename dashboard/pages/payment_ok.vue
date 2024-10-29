<script setup lang="ts">

definePageMeta({ layout: 'none' });

</script>


<template>

    <div class="w-full h-full">


        <div class="flex items-center h-full flex-col gap-4">

            <div class="text-accent mt-[20vh] poppins font-semibold text-[1.5rem]">
                Payment success
            </div>

            <div class="poppins">
                We hope Lilyx can help you make better metrics-driven decision to help your business.
            </div>

            <NuxtLink to="/?just_logged=true" class="text-accent mt-10 bg-menu px-6 py-2 rounded-lg hover:bg-black font-semibold poppins cursor-pointer">
                Go back to dashboard
            </NuxtLink>

        </div>


    </div>

</template>
