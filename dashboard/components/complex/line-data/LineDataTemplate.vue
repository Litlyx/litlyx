<script setup lang="ts">

import { CircleHelp, InfoIcon, Link } from 'lucide-vue-next';
import LineDataCard, { type LineDataCardProps } from './LineDataCard.vue';
import ShowMoreDialog, { type ShowMoreDialogProps } from './ShowMoreDialog.vue';

export type IconProvider<T = any> = (e: { _id: string, count: string } & T) => ['img', string] | ['component', Component] | undefined;


export type LineDataProps = {
    title: string,
    sub: string,
    loading: boolean,
    data: { _id: string, count: number, info?: string, avgSeconds?: number }[],
    iconProvider?: IconProvider<any>,
    iconStyle?: string,
    elementTextTransformer?: (text: string) => string,
    hasLink?: boolean,
    showMoreData: {
        items: { _id: string, count: number }[],
        loading: boolean
    },
    action?: Component,
    actionProps?: Record<string, any>
}


const props = defineProps<{ data: LineDataProps }>();

const total = computed(() => props.data.data.reduce((a, e) => a + e.count, 0));


const emits = defineEmits<{
    (event: 'showMore'): void
}>();

const maxData = computed(() => props.data.data.reduce((a, e) => a + e.count, 0));

function openExternalLink(link: string) {
    if (link === 'self') return;
    return window.open('https://' + link, '_blank');
}

const showMoreDialogData = computed<ShowMoreDialogProps>(() => {
    return {
        title: props.data.title,
        sub: props.data.sub,
        items: props.data.showMoreData.items,
        total: props.data.data.reduce((a, e) => a + e.count, 0),
        loading: props.data.showMoreData.loading,
        iconProvider: props.data.iconProvider,
        iconStyle: props.data.iconStyle
    }
})

const iconsErrored = ref<number[]>([]);

function onIconError(index: number) {
    iconsErrored.value.push(index);
}


</script>

<template>
    <div class="flex flex-col items-center gap-2 h-full">
        <div class="w-full flex flex-col gap-1">
            <div class="flex justify-between text-sm font-medium text-muted-foreground pb-2">
                <p>Source</p>
                <div class="flex gap-2">
                    <p v-if="props.data.data.at(0)?.avgSeconds" class="w-[6rem] text-right">Time Spent</p>
                    <p class="w-16 text-right">Count</p>
                </div>

            </div>
            <div class="flex justify-between items-center" v-if="data.data && data.data.length > 0 && !data.loading"
                v-for="(element, index) of props.data.data">

                <div class="flex items-center gap-2 w-10/12 relative">

                    <div v-if="data.hasLink">
                        <Link @click="openExternalLink(element._id)"
                            class="size-4 cursor-pointer hover:text-muted-foreground">
                        </Link>
                        <i @click="openExternalLink(element._id)"
                            class="fas fa-link text-gray-300 hover:text-gray-400 cursor-pointer"></i>
                    </div>

                    <div class="flex gap-1 items-center">

                        <div class="absolute rounded-sm w-full h-full bg-accent"
                            :style="'width:' + 100 / maxData * element.count + '%;'"></div>

                        <div class="flex px-2 py-1 relative items-center gap-4">
                            <div v-if="data.iconProvider && data.iconProvider(element) != undefined"
                                class="flex items-center h-[1.3rem]">

                                <img v-if="!iconsErrored.includes(index) && data.iconProvider(element)?.[0] === 'img'"
                                    class="h-full" @error="onIconError(index)" :style="data.iconStyle"
                                    :src="(data.iconProvider(element)?.[1] as string)">

                                <CircleHelp v-if="iconsErrored.includes(index)"></CircleHelp>

                                <component v-if="data.iconProvider(element)?.[0] == 'component'" class="size-5"
                                    :is="data.iconProvider(element)?.[1]">
                                </component>
                            </div>
                            <span
                                class=" line-clamp-1 ui-font z-[19] text-[.95rem] max-w-56 md:max-w-64 lg:max-w-96 overflow-x-auto">
                                {{ data.elementTextTransformer?.(element._id) || element._id }}
                            </span>
                            <span v-if="element.info">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger as-child>
                                            <InfoIcon class="size-4"></InfoIcon>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{{ element.info }}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </span>
                        </div>
                    </div>
                </div>
                <span class="text-center w-[6rem] text-[.8rem] text-muted-foreground" v-if="element.avgSeconds">
                    {{ formatTime(element.avgSeconds * 1000, false) }}
                </span>
                <div
                    class="cursor-default w-16 group text-muted-foreground items-center justify-end font-medium text-[.9rem] md:text-[1rem] poppins flex gap-2">
                    <span class="group-hover:hidden flex">
                        {{ formatNumberK(element.count) }}
                    </span>
                    <span class="hidden group-hover:flex "> {{ (100 / total * element.count).toFixed(1) }}% </span>

                </div>

            </div>
        </div>
        <div v-if="data.data.length > 0" class="grow"> </div>
        <Loader v-if="data.loading" />

        <ShowMoreDialog v-if="data.data.length > 0" :data="showMoreDialogData">
            <Button v-if="!data.loading" @click="emits('showMore')" variant="ghost" class="w-full shrink-0">
                Show more
            </Button>
        </ShowMoreDialog>


        <div class="font-medium" v-if="data.title === 'Top pages' && data.data.length == 0 && !data.loading">
            You need at least 2 views
        </div>
        <div class="font-medium" v-else-if="data.data.length == 0 && !data.loading">
            No data yet
        </div>

    </div>

</template>