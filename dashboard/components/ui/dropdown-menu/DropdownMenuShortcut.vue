<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    data-slot="dropdown-menu-shortcut"
    :class="cn('text-gray-500 ml-auto text-xs tracking-widest dark:text-gray-400', props.class)"
  >
    <slot />
  </span>
</template>
