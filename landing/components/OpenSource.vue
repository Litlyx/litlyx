<script lang="ts" setup>

</script>


<template>
    <div class="py-20 bg-black outline relative outline-[3px] outline-[#6e6e6e70] w-[90%] rounded-xl">

        <div class="absolute top-0 w-full h-full overflow-hidden">
            <Globe class="flex justify-end opacity-80"></Globe>
        </div>

        <div class="flex flex-col items-center justify-center gap-2">
            <div class="poppins font-semibold text-[1.6rem] lg:text-[1.9rem] z-[10] text-text-sub text-center">
                We Are Open-Source
            </div>
            <div class="poppins text-[1.35rem] text-text-sub text-center z-[10]">
                Self Host your own analytics Dashboard
            </div>
        </div>

        <div class="flex justify-center mt-10">
            <a href="https://github.com/Litlyx/litlyx" target="_blank"
                class="animated-button poppins font-semibold text-[1.1rem] cursor-pointer px-12 py-3 relative z-[20]">
                Leave a ⭐ on Github
            </a>
        </div>

    </div>
</template>


<style scoped lang="scss">
.animated-button {
    display: grid;
    place-content: center;
    color: white;
    text-shadow: 0 1px 0 #000;
    width: fit-content;

    --border-angle: 0turn; // For animation.

    --main-bg: conic-gradient(from var(--border-angle),
            #213,
            #112 5%,
            #112 60%,
            #213 95%);



    border: solid 2px transparent;
    border-radius: 1rem;
    --gradient-border: conic-gradient(from var(--border-angle), transparent 25%, #08f, #f03 99%, transparent);

    background:
        // padding-box clip this background in to the overall element except the border.
        var(--main-bg) padding-box,
        // border-box extends this background to the border space
        var(--gradient-border) border-box,
        // Duplicate main background to fill in behind the gradient border. You can remove this if you want the border to extend "outside" the box background.
        var(--main-bg) border-box;

    background-position: center center;

    animation: bg-spin 3s linear infinite;

    @keyframes bg-spin {
        to {
            --border-angle: 1turn;
        }
    }

    &:hover {
        animation-play-state: paused;
    }
}

@property --border-angle {
    syntax: "<angle>";
    inherits: true;
    initial-value: 0turn;
}
</style>