<script setup lang="ts">
import { ref, watch } from 'vue'
import { Lock } from 'lucide-vue-next'

// Props e emits
const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Stato locale del valore selezionato
const selectedCountryOption = ref(props.modelValue || '')

// Sync locale ↔ parent
watch(() => props.modelValue, (val) => {
  if (val !== selectedCountryOption.value) {
    selectedCountryOption.value = val || ''
  }
})

watch(selectedCountryOption, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <Select v-model="selectedCountryOption">
    <SelectTrigger class="bg-gray-100 dark:bg-black">
      <SelectValue placeholder="Select a Source" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="continents">
          Continents
        </SelectItem>
        <SelectItem value="countries">
          Country
        </SelectItem>
        <SelectItem value="regions">
          Regions
        </SelectItem>
        <SelectItem value="cities">
           City
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
