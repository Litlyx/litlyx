<script lang="ts" setup>

import type { IconProvider } from './Base.vue';

function iconProvider(e: { _id: string, flag: string, count: number }): ReturnType<IconProvider> {
    let name = e._id.toLowerCase().replace(/ /g, '-');

    if (name === 'mobile-safari') name = 'safari';
    if (name === 'chrome-headless') name = 'chrome'
    if (name === 'chrome-webview') name = 'chrome'

    if (name === 'duckduckgo') return ['icon', 'far fa-duck']
    if (name === 'avast-secure-browser') return ['icon', 'far fa-bug']
    if (name === 'avg-secure-browser') return ['icon', 'far fa-bug']
    
    if (name === 'no_browser') return ['icon', 'far fa-question']
    if (name === 'gsa') return ['icon', 'far fa-question']
    if (name === 'miui-browser') return ['icon', 'far fa-question']
    
    if (name === 'vivo-browser') return ['icon', 'far fa-question']
    if (name === 'whale') return ['icon', 'far fa-question']
    
    if (name === 'twitter') return ['icon', 'fab fa-twitter']
    if (name === 'linkedin') return ['icon', 'fab fa-linkedin']
    if (name === 'facebook') return ['icon', 'fab fa-facebook']

    return [
        'img',
        `https://github.com/alrra/browser-logos/blob/main/src/${name}/${name}_256x256.png?raw=true`
    ]
}

const browsersData = useFetch('/api/data/browsers', {
    headers: useComputedHeaders({ limit: 10, }), lazy: true
});

const { showDialog, dialogBarData, isDataLoading } = useBarCardDialog();

async function showMore() {
    dialogBarData.value = [];
    showDialog.value = true;
    isDataLoading.value = true;

    const res = await $fetch('/api/data/browsers', {
        headers: useComputedHeaders({ limit: 1000 }).value
    });

    dialogBarData.value = res?.map(e => {
        return { ...e, icon: iconProvider(e as any) }
    }) || [];

    isDataLoading.value = false;

}

</script>


<template>
    <div class="flex flex-col gap-2">
        <BarCardBase @showMore="showMore()" @dataReload="browsersData.refresh()" :data="browsersData.data.value || []"
            desc="The browsers most used to search your website." :dataIcons="true" :iconProvider="iconProvider"
            :loading="browsersData.pending.value" label="Browsers" sub-label="Browsers">
        </BarCardBase>
    </div>
</template>
