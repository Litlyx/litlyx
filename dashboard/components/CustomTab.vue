<script lang="ts" setup>



export type CItem = { label: string, slot: string, tab?: string }

const props = defineProps<{
    items: CItem[],
    manualScroll?: boolean,
    route?: boolean
}>();


const router = useRouter();
const route = useRoute();

const activeTabIndex = ref<number>(0);


function updateTab() {
    const target = props.items.findIndex(e => e.tab == route.query.tab);
    if (target == -1) {
        activeTabIndex.value = 0;
    } else {
        activeTabIndex.value = target;
    }
}

function onChangeTab(newIndex: number) {
    activeTabIndex.value = newIndex;
    const target = props.items[newIndex];
    if (!target) return;
    router.push({ query: { tab: target.tab } });
}

onMounted(() => {

    if (props.route !== true) return;

    updateTab();

    watch(route, () => {
        updateTab();
    })

})



</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex overflow-x-auto hide-scrollbars">
            <div class="flex">
                <div v-for="(tab, index) of items" @click="onChangeTab(index)"
                    class="px-6 pb-3 poppins font-medium text-lyx-lightmode-text dark:text-lyx-text-darker border-b-[1px] border-lyx-text-darker"
                    :class="{
                        'dark:!border-[#FFFFFF] dark:!text-[#FFFFFF] !border-lyx-primary !text-lyx-primary': activeTabIndex === index,
                        'hover:border-lyx-lightmode-text-dark hover:text-lyx-lightmode-text-dark/60 dark:hover:border-lyx-text-dark dark:hover:text-lyx-text-dark cursor-pointer': activeTabIndex !== index
                    }">
                    {{ tab.label }}
                </div>
            </div>
            <div class="border-b-[1px] border-lyx-text-darker w-full">

            </div>
        </div>
        <div :class="{ 'overflow-y-hidden': manualScroll }" class="overflow-y-auto h-full">
            <slot :name="props.items[activeTabIndex].slot"></slot>
        </div>
    </div>
</template>