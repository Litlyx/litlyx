<script lang="ts" setup>

const props = defineProps<{ text: string }>();
const currentText = ref<string>("");

onMounted(()=>{

});

</script>


<template>
    <div>{{ text }}</div>
</template>