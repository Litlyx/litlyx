<script lang="ts" setup>

</script>

<template>
    <!-- <div class="bg-gradient-to-b from-violet-300 dark:from-[#7533F3] to-border rounded-md">
        <div class="dark:bg-radial from-[50%] from-[#24114b] to-sidebar m-[1px] p-4 rounded-md">
            <slot></slot>
        </div>
    </div> -->
    <div class="bg-gradient-to-b from-violet-300 dark:from-[#7533F3]/40 to-border rounded-md">
        <div class="dark:bg-linear-to-br from-[20%] from-[#24114b] to-sidebar m-[1px] p-4 rounded-md">
            <slot></slot>
        </div>
    </div>
</template>