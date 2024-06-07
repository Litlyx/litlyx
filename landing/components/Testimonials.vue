<script lang="ts" setup>


const testimonials = ref<{ text: string, name: string, stars: number }[]>([
    // { text: ``, name: "Vik", stars: 5 },
    // { text: ``, name: "Fede", stars: 5 },
    { text: `Litlyx saved me so much time.`, name: "Luca", stars: 5 },
    { text: `This simplicity is a game-changer! Thank you Litlyx.`, name: "Anto", stars: 5 },
    { text: `Transparency & Open-source. Love it!`, name: "Alessio", stars: 5 },
    {
        text: `Litlyx made setting up analytics on my website incredibly easy with just one line of code. 
                At only €9,99 a month, it tracks all KPIs perfectly. Cost-effective I’ve to say!`, name: "Bobby", stars: 5
    },
]);


</script>

<template>
    <div class="flex animated-container w-full h-fit">
        <div v-for="testimonial of testimonials">
            <div class="flex flex-col gap-3 items-center px-20 text-center">
                <div class="poppins font-semibold text-[1.2rem]">
                    {{ testimonial.name }}
                </div>
                <div class="flex gap-2">
                    <i v-for="_ of new Array(testimonial.stars).fill(0)" class="fas fa-star"></i>
                </div>
                <div class="poppins">
                    "{{ testimonial.text }}"
                </div>

            </div>
        </div>
    </div>
</template>



<style scoped lang="scss">
$n: 4;
/* number of elements */

.animated-container {
    --d: 25s;
    /* duration */
    display: grid;
    grid-template-columns: repeat(4, auto);
    /* number of visible elements + width */
    overflow: hidden;
    -webkit-mask: linear-gradient(90deg, #0000, #000 20% 80%, #0000);
}

.animated-container>div {
    grid-area: 1/1;
    display: grid;
    align-content: center;
    gap: 10px;
    background: #000000 padding-box;
    border-radius: 1rem;
    padding: 1rem 1rem;
    border-inline: 10px solid #0000;
    animation: r var(--d) linear infinite;
    height: 15rem;
}

.animated-container>div img {
    width: 100%;
    grid-row: span 2;
}

.animated-container>div * {
    margin: 0
}

.animated-container>div h3 {
    margin-top: auto;
}

@for $i from 2 to ($n + 1) {
    .animated-container>div:nth-child(#{$i}) {
        animation-delay: calc(#{(1 - $i)/$n}*var(--d))
    }
}


$perc: calc(100% / $n);

@keyframes r {
    #{$perc} {
        transform: translate(-100%)
    }

    #{$perc + 0.01%} {
        transform: translate(($n - 1) * 100%)
    }
}
</style>