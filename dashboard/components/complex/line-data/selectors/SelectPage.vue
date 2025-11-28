<script setup lang="ts">
import { ref, watch } from 'vue'
import { Lock } from 'lucide-vue-next'

// Props e emits
const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Stato locale del valore selezionato
const selectPageOption = ref(props.modelValue || '')

// Sync locale ↔ parent
watch(() => props.modelValue, (val) => {
  if (val !== selectPageOption.value) {
    selectPageOption.value = val || ''
  }
})

watch(selectPageOption, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <Select v-model="selectPageOption">
    <SelectTrigger  class="bg-gray-100 dark:bg-black">
      <SelectValue placeholder="Select a Source" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="pages">
          Top Pages
        </SelectItem>


        <SelectItem value="pages_entries">
          Entry Pages
        </SelectItem>
       <SelectItem value="pages_exits">
           Exit Pages
        </SelectItem> 

      </SelectGroup>
    </SelectContent>
  </Select>
</template>
