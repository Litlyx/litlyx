<script lang="ts" setup>

import { Lit } from 'litlyx-js';

Lit.init('6643cd08a1854e3b81722ab5');

const debugMode = process.dev;

const { alerts, closeAlert } = useAlert();

const { showDialog, closeDialog, dialogComponent, dialogParams, dialogStyle, dialogClosable } = useCustomDialog();

const { visible } = usePricingDrawer();

</script>

<template>

  <div class="w-dvw h-dvh bg-lyx-background-light relative">

    <Transition name="pdrawer">
      <LazyPricingDrawer @onCloseClick="visible = false"
        class="bg-black fixed right-0 top-0 w-full xl:w-[60vw] xl:min-w-[65rem] h-full z-[20]" v-if=visible>
      </LazyPricingDrawer>
    </Transition>


    <div class="fixed top-4 right-8 z-[999] flex flex-col gap-2" v-if="alerts.length > 0">
      <div v-for="alert of alerts"
        class="w-[30vw] min-w-[20rem] relative bg-[#151515] overflow-hidden border-solid border-[2px] border-[#262626] rounded-lg p-6 drop-shadow-lg">
        <div class="flex items-start gap-4">
          <div> <i :class="alert.icon"></i> </div>
          <div class="grow">
            <div class="poppins font-semibold">{{ alert.title }}</div>
            <div class="poppins">
              {{ alert.text }}
            </div>
          </div>
          <div>
            <i @click="closeAlert(alert.id)" class="fas fa-close hover:text-[#CCCCCC] cursor-pointer"></i>
          </div>
        </div>
        <div :style="`width: ${Math.floor(100 / alert.ms * alert.remaining)}%; ${alert.transitionStyle}`"
          class="absolute bottom-0 left-0 h-1 bg-lyx-primary z-100 alert-bar"></div>
      </div>
    </div>

    <div v-if="debugMode"
      class="absolute bottom-8 right-4 bg-red-400 text-white text-[.9rem] font-bold px-4 py-[.2rem] rounded-lg z-[100]">
      <div class="poppins flex sm:hidden"> XS </div>
      <div class="poppins hidden sm:max-md:flex"> SM - MOBILE </div>
      <div class="poppins hidden md:max-lg:flex"> MD - TABLET </div>
      <div class="poppins hidden lg:max-xl:flex"> LG - LARGE </div>
      <div class="poppins hidden xl:max-2xl:flex"> XL - EXTRA LARGE </div>
      <div class="poppins hidden 2xl:flex"> 2XL - WIDE SCREEN </div>
    </div>

    <div v-if="showDialog"
      class="custom-dialog w-full h-full flex items-center justify-center lg:pl-32 lg:p-20 p-4 absolute left-0 top-0 z-[100] backdrop-blur-[2px] bg-black/50">
      <div :style="dialogStyle" class="bg-lyx-widget rounded-xl relative outline outline-1 outline-lyx-widget-lighter">
        <div v-if="dialogClosable" class="flex justify-end absolute z-[100] right-8 top-8">
          <i @click="closeDialog()" class="fas fa-close text-[1.6rem] hover:text-gray-500 cursor-pointer"></i>
        </div>
        <div class="flex items-center justify-center w-full h-full p-4">
          <component class="w-full" v-if="dialogComponent" v-bind="dialogParams" :is="dialogComponent"></component>
        </div>
      </div>
    </div>

    <NuxtLayout>
      <NuxtPage></NuxtPage>
    </NuxtLayout>
  </div>

</template>

<style scoped lang="scss">
.pdrawer-enter-active,
.pdrawer-leave-active {
  transition: all .5s ease-in-out;
}

.pdrawer-enter-from,
.pdrawer-leave-to {
  transform: translateX(100%)
}

.pdrawer-enter-to,
.pdrawer-leave-from {
  transform: translateX(0)
}
</style>
