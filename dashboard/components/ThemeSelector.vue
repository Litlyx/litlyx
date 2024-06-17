<script lang="ts" setup>


function cardColor(val: number) {
    document.documentElement.style.setProperty(
        '--current-card-color',
        `var(--card-color-${val})`
    );
}

</script>

<template>
    <div class="flex gap-2 bg-[#151517] py-3 px-8 rounded-lg">
        <div @click="cardColor(1)" class="card1 px-4 py-1 rounded-lg cursor-pointer">
            A
        </div>
        <div @click="cardColor(2)" class="card2 px-4 py-1 rounded-lg cursor-pointer">
            B
        </div>
        <div @click="cardColor(3)" class="card3 px-4 py-1 rounded-lg cursor-pointer">
            C
        </div>
    </div>
</template>


<style scoped lang=scss>
.card1 {
    background-color: var(--card-color-1) !important;
}

.card2 {
    background-color: var(--card-color-2) !important;
}

.card3 {
    background-color: var(--card-color-3) !important;
}
</style>