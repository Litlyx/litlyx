<script lang="ts" setup>

import { Lit } from 'litlyx';

Lit.init('6643cd08a1854e3b81722ab5');

const debugMode = process.dev;

</script>

<template>

  <div class="w-dvw h-dvh bg-[#151517] relative">

    <div v-if="debugMode"
      class="absolute bottom-8 left-4 bg-red-400 text-white text-[.9rem] font-bold px-4 py-[.2rem] rounded-lg z-[100]">
      <div class="poppins flex sm:hidden"> XS </div>
      <div class="poppins hidden sm:max-md:flex"> SM - MOBILE </div>
      <div class="poppins hidden md:max-lg:flex"> MD - TABLET </div>
      <div class="poppins hidden lg:max-xl:flex"> LG - LARGE </div>
      <div class="poppins hidden xl:max-2xl:flex"> XL - EXTRA LARGE </div>
      <div class="poppins hidden 2xl:flex"> 2XL - WIDE SCREEN </div>
    </div>

    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>

</template>
