<script setup lang="ts">
import { ref, watch } from 'vue'
import { Lock } from 'lucide-vue-next'

// Props e emits
const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Stato locale del valore selezionato
const selectedTrafficOption = ref(props.modelValue || '')

export type UtmKey = keyof typeof utmKeysMap;

const utmKeysMap = {
  'utm_campaign': 'Campaign',
  'utm_source': 'Source',
  'utm_medium': 'Medium',
  'utm_term': 'Term',
  'utm_content': 'Content'
}

// Sync locale ↔ parent
watch(() => props.modelValue, (val) => {
  if (val !== selectedTrafficOption.value) {
    selectedTrafficOption.value = val || ''
  }
})

watch(selectedTrafficOption, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <Select v-model="selectedTrafficOption">
    <SelectTrigger class="bg-gray-100 dark:bg-black">
      <SelectValue placeholder="Select a Source" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Sources</SelectLabel>
        <SelectItem value="referrers">
          Referrer
        </SelectItem>
        <SelectSeparator />
        <SelectLabel>UTM</SelectLabel>
        <SelectItem v-for="(value, key) in utmKeysMap" :value="key">
          {{ value }}
        </SelectItem>
        <!-- <SelectSeparator />
        <SelectLabel>Custom</SelectLabel>
        <SelectItem v-if="utm_keys" v-for="key of utm_keys" :value="key._id">
          {{ key._id.split('_').slice(1).join(' ') }}
        </SelectItem> -->
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
