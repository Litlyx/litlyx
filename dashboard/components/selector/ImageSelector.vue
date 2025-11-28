<script setup lang="ts">


const emits = defineEmits<{
    (event: 'file_selected', value: File): void;
}>();

const fileInput = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const triggerFileSelect = () => { (fileInput.value as any).click() }

const handleFileChange = (event: any) => {
    const file = event.target.files[0]
    if (file) emits('file_selected', file);

}

const handleDrop = (event: any) => {
    const file = event.dataTransfer.files[0]
    isDragging.value = false
    if (file) emits('file_selected', file);
}

const handleDragOver = () => {
    isDragging.value = true
}

const handleDragLeave = () => {
    isDragging.value = false
}

</script>



<template>

    <div id="drop-area"
        class="w-full select-none max-w-md border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition"
        @click="triggerFileSelect" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave"
        @drop.prevent="handleDrop" :class="{ 'border-blue-500': isDragging }">
        <p class="text-gray-400">
            Drag & drop an image here
            <br>
            or click to select a file
        </p>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
    </div>

</template>