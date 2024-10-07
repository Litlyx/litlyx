<script lang="ts" setup>

const { project } = useProject();
const { createAlert } = useAlert();

import 'highlight.js/styles/stackoverflow-dark.css';
import hljs from 'highlight.js';
import CardTitled from './CardTitled.vue';

const props = defineProps<{
    firstInteraction: boolean,
    refreshInteraction: () => any
}>()

onMounted(() => {
    hljs.highlightAll();
})

function copyProjectId() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');
    navigator.clipboard.writeText(project.value?._id?.toString() || '');
    createAlert('Success', 'Project id copied successfully.', 'far fa-circle-check', 5000);
}


function copyScript() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');


    const createScriptText = () => {
        return [
            '<script defer ',
            `data-project="${project.value?._id}" `,
            'src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></',
            'script>'
        ].join('')
    }

    navigator.clipboard.writeText(createScriptText());
    createAlert('Success', 'Script copied successfully.', 'far fa-circle-check', 5000);
}


const scriptText = computed(() => {
    return [
        `<script defer data-project="${project.value?._id.toString()}"`,
        `\nsrc="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js">\n<`,
        `/script>`
    ].join('');
})


function reloadPage() {
    location.reload();
}
</script>

<template>

    <div v-if="!firstInteraction && project" class="mt-[5vh] flex flex-col">

        <div class="flex gap-4 items-center justify-center">
            <div class="animate-pulse w-[1.5rem] h-[1.5rem] bg-accent rounded-full"> </div>
            <div class="text-text/90 poppins text-[1.3rem] font-semibold">
                Waiting for your first Visit or Event
            </div>
        </div>
        <div class="flex justify-center mt-4">
            <LyxUiButton type="primary" @click="reloadPage()">
                <div class="flex items-center gap-2">
                    <i class="far fa-refresh"></i>
                    <div> Reload </div>
                </div>
            </LyxUiButton>
        </div>

        <div class="flex items-center justify-center mt-10">
            <div class="flex flex-col gap-6">
                <div class="flex gap-6">
                    <div>
                        <CardTitled class="h-full" title="Tutorial" sub="Coming soon. For now enjoy our launch video.">
                            <div class="flex items-center justify-center h-full">
                                <iframe width="560" height="315"
                                    src="https://www.youtube.com/embed/GntyWMR7jsY?si=YGGkQwrk6-Iqmn8w" title="Litlyx"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                            </div>
                        </CardTitled>
                    </div>

                    <div class="flex flex-col gap-6">

                        <div>
                            <CardTitled title="Quick Integration"
                                sub="Start tracking web analytics in one line. (works everywhere js is supported)">
                                <div class="flex flex-col items-end gap-4">
                                    <div class="w-full">
                                        <pre><code class="language-html">{{ scriptText }}</code></pre>
                                    </div>
                                    <LyxUiButton type="secondary" @click="copyScript()">
                                        Copy
                                    </LyxUiButton>
                                </div>
                            </CardTitled>
                        </div>

                        <div class="h-full w-full">
                            <CardTitled class="h-full w-full" title="Project id"
                                sub="This is the identifier for this project, used to forward data">
                                <div class="flex flex-col items-end">
                                    <div class="w-full text-[.9rem] text-[#acacac]"> {{ project?._id }} </div>
                                    <LyxUiButton type="secondary" @click="copyProjectId()"> Copy </LyxUiButton>
                                </div>
                            </CardTitled>
                        </div>

                    </div>
                </div>
                <div>
                    <div>
                        <CardTitled class="w-full h-full" title="Documentation"
                            sub="Learn how to use Litlyx in every tech stack">
                            <div class="flex flex-col items-end">
                                <div class="flex justify-center w-full">
                                    <svg width="680" height="100" viewBox="0 0 680 100" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <mask id="path-1-inside-1_473_1361" fill="white">
                                            <path
                                                d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z" />
                                        </mask>
                                        <path
                                            d="M0 12C0 5.37258 5.37258 0 12 0H88C94.6274 0 100 5.37258 100 12V88C100 94.6274 94.6274 100 88 100H12C5.37258 100 0 94.6274 0 88V12Z"
                                            fill="#0A0A0A" />
                                        <path
                                            d="M0 12C0 4.8203 5.8203 -1 13 -1H87C94.1797 -1 100 4.8203 100 12C100 5.92487 94.6274 1 88 1H12C5.37258 1 0 5.92487 0 12ZM100 100H0H100ZM0 100V0V100ZM100 0V100V0Z"
                                            fill="#303246" mask="url(#path-1-inside-1_473_1361)" />
                                        <mask id="path-3-inside-2_473_1361" fill="white">
                                            <path
                                                d="M348 12C348 5.37258 353.373 0 360 0H436C442.627 0 448 5.37258 448 12V88C448 94.6274 442.627 100 436 100H360C353.373 100 348 94.6274 348 88V12Z" />
                                        </mask>
                                        <path
                                            d="M348 12C348 5.37258 353.373 0 360 0H436C442.627 0 448 5.37258 448 12V88C448 94.6274 442.627 100 436 100H360C353.373 100 348 94.6274 348 88V12Z"
                                            fill="#0A0A0A" />
                                        <path
                                            d="M348 12C348 4.8203 353.82 -1 361 -1H435C442.18 -1 448 4.8203 448 12C448 5.92487 442.627 1 436 1H360C353.373 1 348 5.92487 348 12ZM448 100H348H448ZM348 100V0V100ZM448 0V100V0Z"
                                            fill="#303246" mask="url(#path-3-inside-2_473_1361)" />
                                        <path
                                            d="M398 80C414.569 80 428 66.5685 428 50C428 33.4315 414.569 20 398 20C381.431 20 368 33.4315 368 50C368 66.5685 381.431 80 398 80Z"
                                            fill="white" />
                                        <path
                                            d="M417.836 72.5068L391.047 38H386V61.99H390.038V43.1278L414.666 74.9484C415.778 74.2045 416.836 73.3884 417.836 72.5068Z"
                                            fill="url(#paint0_linear_473_1361)" />
                                        <path d="M410.333 38H406.333V62H410.333V38Z"
                                            fill="url(#paint1_linear_473_1361)" />
                                        <mask id="path-8-inside-3_473_1361" fill="white">
                                            <path
                                                d="M116 12C116 5.37258 121.373 0 128 0H204C210.627 0 216 5.37258 216 12V88C216 94.6274 210.627 100 204 100H128C121.373 100 116 94.6274 116 88V12Z" />
                                        </mask>
                                        <path
                                            d="M116 12C116 5.37258 121.373 0 128 0H204C210.627 0 216 5.37258 216 12V88C216 94.6274 210.627 100 204 100H128C121.373 100 116 94.6274 116 88V12Z"
                                            fill="#0A0A0A" />
                                        <path
                                            d="M116 12C116 4.8203 121.82 -1 129 -1H203C210.18 -1 216 4.8203 216 12C216 5.92487 210.627 1 204 1H128C121.373 1 116 5.92487 116 12ZM216 100H116H216ZM116 100V0V100ZM216 0V100V0Z"
                                            fill="#303246" mask="url(#path-8-inside-3_473_1361)" />
                                        <path d="M182.2 27H193L166 73.575L139 27H159.655L166 37.8L172.21 27H182.2Z"
                                            fill="#41B883" />
                                        <path d="M139 27L166 73.575L193 27H182.2L166 54.945L149.665 27H139Z"
                                            fill="#41B883" />
                                        <path d="M149.665 27L166 55.08L182.2 27H172.21L166 37.8L159.655 27H149.665Z"
                                            fill="#35495E" />
                                        <path
                                            d="M53.6605 70H75.9651C76.6735 70.0001 77.3695 69.8153 77.983 69.4642C78.5965 69.1131 79.1059 68.6081 79.46 67.9999C79.8141 67.3918 80.0003 66.7019 80 65.9998C79.9997 65.2977 79.8128 64.608 79.4582 64.0002L64.4791 38.2859C64.1251 37.6779 63.6158 37.173 63.0024 36.8219C62.389 36.4709 61.6932 36.2861 60.9849 36.2861C60.2766 36.2861 59.5808 36.4709 58.9674 36.8219C58.354 37.173 57.8447 37.6779 57.4906 38.2859L53.6605 44.8653L46.1721 31.9995C45.8177 31.3916 45.3082 30.8867 44.6946 30.5358C44.0811 30.1848 43.3852 30 42.6767 30C41.9683 30 41.2724 30.1848 40.6588 30.5358C40.0453 30.8867 39.5357 31.3916 39.1814 31.9995L20.5418 64.0002C20.1872 64.608 20.0003 65.2977 20 65.9998C19.9997 66.7019 20.1859 67.3918 20.54 67.9999C20.8941 68.6081 21.4035 69.1131 22.017 69.4642C22.6305 69.8153 23.3265 70.0001 24.0349 70H38.0359C43.5832 70 47.6741 67.585 50.4891 62.8734L57.3233 51.143L60.9838 44.8653L71.9698 63.7222H57.3233L53.6605 70ZM37.8076 63.7158L28.0367 63.7136L42.6833 38.5724L49.9913 51.143L45.0983 59.545C43.2289 62.602 41.1051 63.7158 37.8076 63.7158Z"
                                            fill="#00DC82" />
                                        <mask id="path-14-inside-4_473_1361" fill="white">
                                            <path
                                                d="M464 12C464 5.37258 469.373 0 476 0H552C558.627 0 564 5.37258 564 12V88C564 94.6274 558.627 100 552 100H476C469.373 100 464 94.6274 464 88V12Z" />
                                        </mask>
                                        <path
                                            d="M464 12C464 5.37258 469.373 0 476 0H552C558.627 0 564 5.37258 564 12V88C564 94.6274 558.627 100 552 100H476C469.373 100 464 94.6274 464 88V12Z"
                                            fill="#0A0A0A" />
                                        <path
                                            d="M464 12C464 4.8203 469.82 -1 477 -1H551C558.18 -1 564 4.8203 564 12C564 5.92487 558.627 1 552 1H476C469.373 1 464 5.92487 464 12ZM564 100H464H564ZM464 100V0V100ZM564 0V100V0Z"
                                            fill="#303246" mask="url(#path-14-inside-4_473_1361)" />
                                        <path
                                            d="M514 55.299C517.088 55.299 519.591 52.7959 519.591 49.7081C519.591 46.6203 517.088 44.1172 514 44.1172C510.912 44.1172 508.409 46.6203 508.409 49.7081C508.409 52.7959 510.912 55.299 514 55.299Z"
                                            fill="#61DAFB" />
                                        <path
                                            d="M514 61.1625C530.569 61.1625 544 56.0341 544 49.708C544 43.3818 530.569 38.2534 514 38.2534C497.431 38.2534 484 43.3818 484 49.708C484 56.0341 497.431 61.1625 514 61.1625Z"
                                            stroke="#61DAFB" stroke-width="5" />
                                        <path
                                            d="M504.08 55.4353C512.364 69.7841 523.521 78.8519 529 75.6888C534.479 72.5257 532.204 58.3295 523.92 43.9808C515.636 29.632 504.479 20.5642 499 23.7273C493.521 26.8904 495.796 41.0865 504.08 55.4353Z"
                                            stroke="#61DAFB" stroke-width="5" />
                                        <path
                                            d="M504.08 43.9808C495.796 58.3296 493.521 72.5258 499 75.6888C504.479 78.8519 515.636 69.7841 523.92 55.4354C532.204 41.0866 534.479 26.8904 529 23.7273C523.521 20.5642 512.364 29.632 504.08 43.9808Z"
                                            stroke="#61DAFB" stroke-width="5" />
                                        <mask id="path-20-inside-5_473_1361" fill="white">
                                            <path
                                                d="M232 12C232 5.37258 237.373 0 244 0H320C326.627 0 332 5.37258 332 12V88C332 94.6274 326.627 100 320 100H244C237.373 100 232 94.6274 232 88V12Z" />
                                        </mask>
                                        <path
                                            d="M232 12C232 5.37258 237.373 0 244 0H320C326.627 0 332 5.37258 332 12V88C332 94.6274 326.627 100 320 100H244C237.373 100 232 94.6274 232 88V12Z"
                                            fill="#0A0A0A" />
                                        <path
                                            d="M232 12C232 4.8203 237.82 -1 245 -1H319C326.18 -1 332 4.8203 332 12C332 5.92487 326.627 1 320 1H244C237.373 1 232 5.92487 232 12ZM332 100H232H332ZM232 100V0V100ZM332 0V100V0Z"
                                            fill="#303246" mask="url(#path-20-inside-5_473_1361)" />
                                        <path
                                            d="M282 20C298.569 20 312 33.4314 312 50C312 66.5686 298.569 80 282 80C265.431 80 252 66.5686 252 50C252 33.4314 265.431 20 282 20Z"
                                            fill="black" />
                                        <path
                                            d="M281.327 64.6787C280.558 64.4713 279.766 64.9167 279.541 65.6761L279.531 65.7115L277.539 73.0943L277.53 73.1299C277.342 73.8995 277.802 74.6827 278.572 74.8901C279.341 75.0979 280.132 74.6525 280.357 73.8929L280.367 73.8577L282.359 66.4749L282.369 66.4391C282.382 66.3837 282.392 66.3279 282.399 66.2723L282.405 66.2167L282.358 65.9775L282.289 65.6331L282.245 65.4181C282.152 65.2379 282.022 65.0791 281.864 64.9517C281.706 64.8245 281.523 64.7315 281.327 64.6787ZM267.445 57.0757C267.408 57.1481 267.378 57.2245 267.353 57.3043L267.339 57.3525L265.347 64.7353L265.338 64.7711C265.15 65.5407 265.61 66.3237 266.38 66.5313C267.149 66.7389 267.941 66.2937 268.166 65.5341L268.176 65.4987L269.982 58.8045C269.036 58.3035 268.187 57.7255 267.445 57.0757ZM262.694 48.5857C261.925 48.3781 261.133 48.8233 260.908 49.5829L260.898 49.6183L258.906 57.0011L258.897 57.0367C258.709 57.8063 259.169 58.5893 259.939 58.7969C260.708 59.0045 261.499 58.5593 261.725 57.7997L261.734 57.7643L263.727 50.3815L263.736 50.3459C263.923 49.5763 263.463 48.7933 262.694 48.5857ZM307.364 46.9091C306.595 46.7015 305.803 47.1467 305.578 47.9063L305.568 47.9417L303.576 55.3245L303.567 55.3601C303.379 56.1297 303.839 56.9127 304.608 57.1203C305.378 57.3279 306.169 56.8827 306.394 56.1231L306.404 56.0877L308.396 48.7049L308.406 48.6693C308.593 47.8997 308.133 47.1167 307.364 46.9091ZM258.356 37.0504C256.687 40.0887 255.625 43.4223 255.228 46.8657C255.418 47.0823 255.668 47.2379 255.946 47.3125C256.715 47.5203 257.507 47.0749 257.732 46.3153L257.742 46.2801L259.734 38.8972L259.743 38.8616C259.931 38.0919 259.471 37.3088 258.701 37.1013C258.589 37.0708 258.472 37.0538 258.356 37.0504ZM302.318 37.1013C301.549 36.8936 300.757 37.3389 300.532 38.0985L300.522 38.1338L298.53 45.5167L298.521 45.5523C298.333 46.3219 298.793 47.1051 299.563 47.3125C300.332 47.5203 301.123 47.0749 301.349 46.3153L301.358 46.2801L303.351 38.8972L303.36 38.8616C303.547 38.0919 303.087 37.3088 302.318 37.1013Z"
                                            fill="white" />
                                        <path
                                            d="M267.026 30.0813C266.256 29.8736 265.465 30.319 265.24 31.0786L265.23 31.1138L263.238 38.4967L263.229 38.5323C263.041 39.302 263.501 40.085 264.27 40.2926C265.04 40.5002 265.831 40.0548 266.056 39.2953L266.066 39.26L268.058 31.8772L268.067 31.8416C268.255 31.0719 267.795 30.2888 267.026 30.0813ZM292.623 31.4769C291.854 31.2692 291.062 31.7145 290.837 32.4742L290.827 32.5094L289.489 37.47C290.356 37.8983 291.183 38.4025 291.962 38.9768L292.091 39.0729L293.656 33.2728L293.665 33.2372C293.852 32.4675 293.393 31.6844 292.623 31.4769ZM279.594 23.1528C278.659 23.2354 277.729 23.3668 276.809 23.5463L276.613 23.5853L274.756 30.4684L274.747 30.504C274.56 31.2737 275.02 32.0567 275.789 32.2643C276.558 32.4719 277.35 32.0266 277.575 31.267L277.585 31.2317L279.577 23.8489L279.586 23.8133C279.639 23.5966 279.642 23.3707 279.594 23.1528ZM297.925 28.2526L297.534 29.7034L297.525 29.7389C297.337 30.5086 297.797 31.2916 298.566 31.4992C299.336 31.7068 300.127 31.2615 300.352 30.5019L300.362 30.4666L300.405 30.3092C299.672 29.6241 298.902 28.9802 298.098 28.3804L297.925 28.2526ZM286.334 23.3935L285.628 26.0119L285.619 26.0475C285.431 26.8172 285.891 27.6002 286.661 27.8078C287.43 28.0154 288.221 27.5701 288.447 26.8105L288.456 26.7752L289.2 24.0193C288.325 23.7773 287.438 23.58 286.543 23.4281L286.334 23.3935Z"
                                            fill="white" />
                                        <path
                                            d="M271.382 69.2504C271.607 68.4908 272.398 68.0456 273.168 68.253C273.937 68.4604 274.397 69.2436 274.209 70.0134L274.2 70.049L272.774 75.3326L272.575 75.2592C271.717 74.9386 270.875 74.5744 270.054 74.1676L271.372 69.2856L271.382 69.2504Z"
                                            fill="white" />
                                        <path
                                            d="M280.828 36.9814C272.104 36.9814 265.318 42.4734 265.318 49.3032C265.318 55.7536 271.562 59.8722 281.242 59.666C282.065 59.6484 282.303 60.2014 282.571 60.9466C282.839 61.6918 283.559 65.6192 284.133 68.6232C284.647 71.3118 285.168 74.0102 285.567 76.719C291.888 75.8834 297.733 72.7612 302.015 68.052L297.447 51.0174C296.309 46.9034 294.978 43.1126 291.457 40.3586C288.624 38.1431 285.024 36.9814 280.828 36.9814Z"
                                            fill="white" />
                                        <path
                                            d="M282.703 41.9141C283.739 41.9141 284.578 42.7535 284.578 43.7891C284.578 44.8247 283.739 45.6641 282.703 45.6641C281.668 45.6641 280.828 44.8247 280.828 43.7891C280.828 42.7535 281.668 41.9141 282.703 41.9141Z"
                                            fill="black" />
                                        <mask id="path-28-inside-6_473_1361" fill="white">
                                            <path
                                                d="M580 12C580 5.37258 585.373 0 592 0H668C674.627 0 680 5.37258 680 12V88C680 94.6274 674.627 100 668 100H592C585.373 100 580 94.6274 580 88V12Z" />
                                        </mask>
                                        <path
                                            d="M580 12C580 5.37258 585.373 0 592 0H668C674.627 0 680 5.37258 680 12V88C680 94.6274 674.627 100 668 100H592C585.373 100 580 94.6274 580 88V12Z"
                                            fill="#0A0A0A" />
                                        <path
                                            d="M580 12C580 4.8203 585.82 -1 593 -1H667C674.18 -1 680 4.8203 680 12C680 5.92487 674.627 1 668 1H592C585.373 1 580 5.92487 580 12ZM680 100H580H680ZM580 100V0V100ZM680 0V100V0Z"
                                            fill="#303246" mask="url(#path-28-inside-6_473_1361)" />
                                        <path d="M655 25H605V75H655V25Z" fill="#F7DF1E" />
                                        <path
                                            d="M638.587 64.0625C639.594 65.7069 640.905 66.9156 643.222 66.9156C645.169 66.9156 646.413 65.9426 646.413 64.5982C646.413 62.9871 645.135 62.4164 642.992 61.4791L641.817 60.9752C638.427 59.5307 636.175 57.7212 636.175 53.8958C636.175 50.372 638.859 47.6895 643.056 47.6895C646.043 47.6895 648.19 48.7291 649.738 51.4514L646.079 53.8006C645.274 52.3561 644.405 51.7871 643.056 51.7871C641.679 51.7871 640.807 52.6601 640.807 53.8006C640.807 55.2101 641.68 55.7807 643.696 56.6537L644.871 57.1569C648.863 58.8688 651.117 60.6141 651.117 64.5379C651.117 68.768 647.794 71.0855 643.331 71.0855C638.967 71.0855 636.148 69.0061 634.769 66.2807L638.587 64.0625ZM621.99 64.4696C622.728 65.7791 623.399 66.8863 625.013 66.8863C626.557 66.8863 627.531 66.2823 627.531 63.9339V47.9577H632.229V63.9974C632.229 68.8625 629.377 71.0768 625.213 71.0768C621.452 71.0768 619.273 69.1299 618.165 66.7851L621.99 64.4696Z"
                                            fill="black" />
                                        <defs>
                                            <linearGradient id="paint0_linear_473_1361" x1="404.333" y1="58.8334"
                                                x2="416.167" y2="73.5" gradientUnits="userSpaceOnUse">
                                                <stop />
                                                <stop offset="1" stop-color="white" stop-opacity="0" />
                                            </linearGradient>
                                            <linearGradient id="paint1_linear_473_1361" x1="408.334" y1="38"
                                                x2="408.267" y2="55.6251" gradientUnits="userSpaceOnUse">
                                                <stop />
                                                <stop offset="1" stop-color="white" stop-opacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <LyxUiButton type="secondary" to="https://docs.litlyx.com"> Visit documentation
                                </LyxUiButton>
                            </div>
                        </CardTitled>
                    </div>
                </div>
            </div>
        </div>





        <!-- <div class="flex justify-center gap-10 flex-col lg:flex-row items-center lg:items-stretch px-10">

            <div class="bg-menu p-6 rounded-xl flex flex-col gap-2 w-full">
                <div class="poppins font-semibold"> Copy your project_id: </div>
                <div class="flex items-center gap-2">
                    <div> <i @click="copyProjectId()" class="cursor-pointer hover:text-text far fa-copy"></i> </div>
                    <div class="text-[.9rem] text-[#acacac]"> {{ activeProject?._id }} </div>
                </div>
            </div>

            <div class="bg-menu p-6 rounded-xl flex flex-col gap-2 w-full lg:max-w-[40vw]">
                <div class="poppins font-semibold">
                    Start logging visits in 1 click | Plug anywhere !
                </div>
                <div class="flex items-center gap-4">
                    <div> <i @click="copyScript()" class="cursor-pointer hover:text-text far fa-copy"></i> </div>

                    <pre><code class="language-html">{{ scriptText }}</code></pre>

                </div>
            </div>

        </div> -->

    </div>

</template>
