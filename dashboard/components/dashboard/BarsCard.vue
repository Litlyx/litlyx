<script lang="ts" setup>


export type IconProvider = (id: string) => ['img' | 'icon', string] | undefined;


type Props = {
    data: { _id: string, count: number }[],
    iconProvider?: IconProvider,
    elementTextTransformer?: (text: string) => string,
    label: string,
    subLabel: string,
    desc: string,
    loading?: boolean,
    interactive?: boolean,
    isDetailView?: boolean,
    rawButton?: boolean,
    hideShowMore?: boolean,
    customIconStyle?: string,
    showLink?: boolean
}
const props = defineProps<Props>();
const emits = defineEmits<{
    (e: 'dataReload'): void,
    (e: 'showDetails', id: string): void,
    (e: 'showRawData'): void,
    (e: 'showGeneral'): void,
    (e: 'showMore'): void,
}>();

const maxData = computed(() => {
    const counts = props.data.map(e => e.count);
    return Math.max(...counts);
});

function reloadData() {
    emits('dataReload');
}

function showDetails(id: string) {
    emits('showDetails', id);
}

function openExternalLink(link: string) {
    if (link === 'self') return;
    return window.open('https://' + link, '_blank');
}

</script>

<template>

    <div class="flex h-full">

        <div class="text-text flex flex-col items-start gap-4 w-full relative">

            <div class="w-full h-full p-4 flex flex-col bg-card rounded-xl gap-8 card-shadow">

                <div class="flex justify-between mb-3">
                    <div class="flex flex-col gap-1">
                        <div class="flex gap-4 items-center">
                            <div class="poppins font-semibold text-[1.4rem] text-text">
                                {{ label }}
                            </div>
                            <div class="flex items-center">
                                <i @click="reloadData()"
                                    class="hover:rotate-[50deg] transition-all duration-100 fas fa-refresh text-[1.2rem] cursor-pointer"></i>

                            </div>
                        </div>
                        <div class="poppins text-[1rem] text-text-sub/90">
                            {{ desc }}
                        </div>
                    </div>
                    <div v-if="rawButton" class="hidden lg:flex">
                        <div @click="$emit('showRawData')"
                            class="cursor-pointer flex gap-1 items-center justify-center font-semibold poppins rounded-lg text-[#5680f8] hover:text-[#5681f8ce]">
                            <div> Raw data </div>
                            <div class="flex items-center"> <i class="fas fa-arrow-up-right"></i> </div>
                        </div>

                    </div>
                </div>

                <div>
                    <div class="flex justify-between font-bold text-text-sub/80 text-[1.1rem] mb-4">
                        <div class="flex items-center gap-2">
                            <div v-if="isDetailView" class="flex items-center justify-center">
                                <i @click="$emit('showGeneral')"
                                    class="fas fa-arrow-left text-[.9rem] hover:text-text cursor-pointer"></i>
                            </div>
                            <div> {{ subLabel }} </div>
                        </div>
                        <div> Count </div>
                    </div>

                    <div class="flex flex-col gap-1">

                        <div v-if="props.data.length > 0" class="flex justify-between items-center"
                            v-for="element of props.data">

                            <div class="flex items-center gap-2 w-10/12 relative">

                                <div v-if="showLink">
                                    <i @click="openExternalLink(element._id)"
                                        class="fas fa-link text-gray-300 hover:text-gray-400 cursor-pointer"></i>
                                </div>

                                <div class="flex gap-1 items-center" @click="showDetails(element._id)"
                                    :class="{ 'cursor-pointer line-active': interactive }">

                                    <div class="absolute rounded-sm w-full h-full bg-[#92abcf38]"
                                        :style="'width:' + 100 / maxData * element.count + '%;'"></div>

                                    <div class="flex px-2 py-1 relative items-center gap-4">
                                        <div v-if="iconProvider && iconProvider(element._id) != undefined"
                                            class="flex items-center h-[1.3rem]">

                                            <img v-if="iconProvider(element._id)?.[0] == 'img'" class="h-full"
                                                :style="customIconStyle" :src="iconProvider(element._id)?.[1]">

                                            <i v-else :class="iconProvider(element._id)?.[1]"></i>
                                        </div>
                                        <span
                                            class="text-ellipsis line-clamp-1 ui-font z-[20] text-[.95rem] text-text/70">
                                            {{ elementTextTransformer?.(element._id) || element._id }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="text-text font-semibold text-[.9rem] md:text-[1rem] manrope"> {{
                                formatNumberK(element.count) }} </div>
                        </div>
                        <div v-if="props.data.length == 0"
                            class="flex justify-center text-text-sub font-bold text-[1.1rem]">
                            No visits yet
                        </div>
                    </div>
                    <div v-if="!hideShowMore" class="flex justify-center mt-4 text-text-sub/90 ">
                        <div @click="$emit('showMore')"
                            class="poppins hover:bg-black cursor-pointer w-fit px-6 py-1 rounded-lg border-[1px] border-text-sub text-[.9rem]">
                            Show more
                        </div>
                    </div>
                </div>

                <div v-if="loading"
                    class="backdrop-blur-[1px] z-[20] left-0 top-0 w-full h-full flex items-center justify-center font-bold rockmann absolute">
                    <i
                        class="fas fa-spinner text-[2rem] text-accent animate-[spin_1s_linear_infinite] duration-500"></i>
                </div>

            </div>

        </div>

    </div>

</template>


<style scoped lang="scss">
.line-active:hover {
    .absolute {
        @apply bg-accent/20
    }

}

.ui-font {
    font-feature-settings: normal;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    font-variation-settings: normal;
    font-weight: 600;
    line-height: 1.5;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4
}
</style>
