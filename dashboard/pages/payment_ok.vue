<script lang="ts" setup>
const colorMode = useColorMode();
const confetti = ref<HTMLElement | null>(null)

onMounted(() => {
  const total = 100
  for (let i = 0; i < total; i++) {
    const el = document.createElement('div')
    el.className = 'confetti'
    
    // Posizione iniziale al centro in basso
    el.style.left = '50%'
    el.style.bottom = '40%'
    
    // Colore random
    el.style.backgroundColor = ['#F44336', '#FFC107', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 4)]

    // Movimento random verso l'alto con angolazione
    const angle = Math.random() * 2 * Math.PI
    const distance = 100 + Math.random() * 200 // px
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance

    el.style.setProperty('--x', `${x}px`)
    el.style.setProperty('--y', `${-Math.abs(y)}px`)
    el.style.animationDuration = `${1 + Math.random()}s`

    confetti.value?.appendChild(el)

    setTimeout(() => el.remove(), 2000)
  }
})
</script>

<template>
  <div class="relative flex justify-center items-center h-dvh poppins">
    <!-- Confetti container -->
    <div ref="confetti" class="absolute inset-0 pointer-events-none z-0 overflow-hidden" />

    <Card class="flex items-center justify-center min-w-[52dvw] min-h-[72dvh]">
      <CardContent class="flex flex-col gap-4 text-center m-8 z-2">
        <div class="flex justify-center">
          <img
            :src="colorMode.value === 'dark' ? '/logo-white.svg' : '/logo-black.svg'"
            class="object-contain w-40"
          />
        </div>
        <div>
          <PageHeader
            title="Payment Successfull!"
            description="Thanks for choosing Litlyx. You're ready to go!"
          />
        </div>
        <NuxtLink to="/"><Button class="w-full">Dashboard</Button></NuxtLink>
      </CardContent>
    </Card>
  </div>
</template>

<style>
.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  opacity: 0.9;
  transform: translate(-50%, 0);
  animation: explode 2s ease-out forwards;
}

@keyframes explode {
  0% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--x)), var(--y)) scale(0.8);
    opacity: 0;
  }
}
</style>

