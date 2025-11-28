<script lang="ts" setup>
const colorMode = useColorMode();
</script>

<template>
  <div class="flex justify-center items-center h-dvh poppins">

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
            title="Payment Error!"
            description="An error occurred while payment"
          />
        </div>
        <NuxtLink to="/plans"><Button class="w-full">Plans</Button></NuxtLink>
      </CardContent>
    </Card>
  </div>
</template>


