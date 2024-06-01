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

</script>


<template>
    <div class="w-fit h-fit">

        <svg xmlns="http://www.w3.org/2000/svg" :width="widthHeight" :height="widthHeight" :style="`opacity: ${props.opacity};`"
            fill="none">

            <template v-for="(p, x) of sizeArr">
                <template v-for="(p, y) of sizeArr">
                    <circle :cx="9 + (spacing * x)" :cy="9 + (spacing * y)" r="1" fill="#fff"
                        :fill-opacity="calculateOpacity(x, y)" />
                </template>
            </template>

            <!-- <circle cx="27" cy="9" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="45" cy="9" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="63" cy="9" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="81" cy="9" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="99" cy="9" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="117" cy="9" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="135" cy="9" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="9" cy="27" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="27" cy="27" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="45" cy="27" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="63" cy="27" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="81" cy="27" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="99" cy="27" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="117" cy="27" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="135" cy="27" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="9" cy="45" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="27" cy="45" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="45" cy="45" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="63" cy="45" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="81" cy="45" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="99" cy="45" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="117" cy="45" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="135" cy="45" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="9" cy="63" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="27" cy="63" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="45" cy="63" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="63" cy="63" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="81" cy="63" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="99" cy="63" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="117" cy="63" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="135" cy="63" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="9" cy="81" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="27" cy="81" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="45" cy="81" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="63" cy="81" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="81" cy="81" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="99" cy="81" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="117" cy="81" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="135" cy="81" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="9" cy="99" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="27" cy="99" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="45" cy="99" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="63" cy="99" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="81" cy="99" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="99" cy="99" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="117" cy="99" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="135" cy="99" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="9" cy="117" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="27" cy="117" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="45" cy="117" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="63" cy="117" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="81" cy="117" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="99" cy="117" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="117" cy="117" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="135" cy="117" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="9" cy="135" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="27" cy="135" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="45" cy="135" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="63" cy="135" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="81" cy="135" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="99" cy="135" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="117" cy="135" r="1" fill="#fff" fill-opacity=".9" />
            <circle cx="135" cy="135" r="1" fill="#fff" fill-opacity=".9" />
            -->
        </svg>

    </div>
</template>