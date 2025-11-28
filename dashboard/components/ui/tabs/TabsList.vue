<script setup lang="ts">
import { cn } from '@/lib/utils'
import { TabsList, type TabsListProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="delegatedProps"
    :class="cn(
'bg-gray-100 dark:bg-muted border border-gray-200 dark:border-zinc-800 text-muted-foreground inline-flex h-12 w-fit gap-2 items-center justify-center rounded-lg p-[4px]',
      props.class,
    )"
  >
    <slot />
  </TabsList>
</template>
