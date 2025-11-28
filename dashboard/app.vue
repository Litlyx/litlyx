<script setup lang="ts">
const { data: onboarding } = useAuthFetch<{ exists: boolean }>('/api/user/onboarding/exists', { key: 'onboarding' });
const colorMode = useColorMode()

await callOnce('user', async () => {
  const { loadData } = useAppStart();
  await loadData();
});

import { Toaster } from '@/components/ui/sonner'

</script>

<template>

  <ClientOnly>
    <Toaster :rich-colors="colorMode.value === 'light' ? true : false" />
    <GlobalDialog></GlobalDialog>
  </ClientOnly>

  <ClientOnly>
    <div v-if="onboarding && onboarding.exists === false && !isSelfhosted()">
      <Onboarding></Onboarding>
    </div>
  </ClientOnly>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

</template>
