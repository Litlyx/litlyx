<script lang="ts" setup>

</script>


<template>
    <div>
        <div class="lg:hidden">
            <slot></slot>
        </div>
        <div class="hidden lg:flex">
            <slot name="desktop"></slot>
        </div>
    </div>
</template>