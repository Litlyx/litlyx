<script lang="ts" setup>

const builtinEvents = [
    { name: 'INFO', color: '#33a0e8' },
    { name: 'WARNING', color: '#ef8d44' },
    { name: 'ERROR', color: '#e47069' },
]

</script>


<template>

    <div class="flex flex-col gap-2">
        <div class="bg-[#2a2e34] outline outline-[1px] outline-[#bdbdbd70] rounded-lg p-2 px-4 flex gap-2 items-center w-full" v-for="e of builtinEvents">
            <div :style="`background-color: ${e.color}`" class="w-[1rem] h-[1rem] rounded-full"> </div>
            <div class="poppins"> {{ e.name }} </div>
            <div class="grow"></div>
            <!-- <div> <i class="far fa-trash"></i> </div> -->
        </div>
    </div>

</template>