<script lang="ts" setup>
defineProps<{ title: string, link?: any, locked?: boolean, disabled?: boolean }>();
defineEmits<{
  (evt: 'action'): void;
}>();
</script>
<template>

  <TooltipProvider v-if="locked">
    <Tooltip>
      <TooltipTrigger>
        <NuxtLink :to="isSelfhosted() ? 'https://litlyx.com/pricing-selfhosted' : '/plans'">
          <Button
            class="cursor-pointer dark:text-violet-200 bg-violet-500 hover:!bg-violet-600/80 dark:bg-violet-500/20 hover:dark:!bg-violet-500/30">
            <Badge class="text-amber-500 bg-amber-100 dark:bg-amber-500/10 uppercase">pro</Badge>
            <div class="font-medium poppins">
              Upgrade Plan
            </div>
          </Button>
        </NuxtLink>
      </TooltipTrigger>
      <TooltipContent>
        <p>Reached plan limits</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  <NuxtLink v-if="!locked && link" :to="link ?? '#'" class="cursor-pointer poppins">
    <Button :disabled="disabled">
      <slot></slot>
      {{ title }}
    </Button>
  </NuxtLink>
  <Button v-if="!locked && !link" :disabled="disabled" @click="$emit('action')">
    <slot></slot>
    {{ title }}
  </Button>
</template>