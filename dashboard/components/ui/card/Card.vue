<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-white text-gray-950 flex flex-col gap-6 rounded-xl border border-border py-6 shadow-sm dark:bg-card dark:text-card-foreground dark:border-border',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
