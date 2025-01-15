<script lang="ts" setup>



type Props = {
    size: number,
    spacing: number,
    opacity: string
}

const props = defineProps<Props>();

const sizeArr = new Array(props.size).fill('a');

function calculateOpacity(x: number, y: number) {
    const distanceFromCenter = Math.sqrt(Math.pow(x - props.size / 2, 2) + Math.pow(y - props.size / 2, 2));
    const normalizedDistance = distanceFromCenter / (props.size / 2);
    return (1 - normalizedDistance).toFixed(1);
}

const widthHeight = computed(() => {
    return 9 + props.size * props.spacing;
});



const colorMode = useColorMode();


</script>


<template>
    <div class="w-fit h-fit">


        <svg xmlns="http://www.w3.org/2000/svg" :width="widthHeight" :height="widthHeight" :style="`opacity: ${props.opacity};`"
            fill="none">

            <template v-for="(p, x) of sizeArr">
                <template v-for="(p, y) of sizeArr">
                    <circle :cx="9 + (spacing * x)" :cy="9 + (spacing * y)" r="1" :fill="colorMode.value === 'light' ? '#000' : '#FFF'"
                        :fill-opacity="calculateOpacity(x, y)" />
                </template>
            </template>
        </svg>

    </div>
</template>