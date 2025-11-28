<script setup lang="ts">
import { ref, watch } from 'vue'

// Props e emits
const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Stato locale del valore selezionato
const selectedDeviceOption = ref(props.modelValue || '')

// Sync locale ↔ parent
watch(() => props.modelValue, (val) => {
  if (val !== selectedDeviceOption.value) {
    selectedDeviceOption.value = val || ''
  }
})

watch(selectedDeviceOption, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <Select v-model="selectedDeviceOption">
    <SelectTrigger  class="bg-gray-100 dark:bg-black">
      <SelectValue placeholder="Select a Source" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="devices">
          Devices
        </SelectItem>
        <SelectItem value="oss">
          OS
        </SelectItem>
        <SelectItem value="browsers">
          Browsers
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

