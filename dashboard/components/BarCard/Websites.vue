<script lang="ts" setup>

const currentWebsite = ref<string>("");

const websitesData = useFetch('/api/data/websites', {
    headers: useComputedHeaders({
        limit: 10,
    }), lazy: true
});

const pagesData = useFetch('/api/data/websites_pages', {
    headers: useComputedHeaders({
        limit: 10,
        custom: {
            'x-website-name': currentWebsite
        }
    }), lazy: true
});


const isPagesView = ref<boolean>(false);

const currentData = computed(() => {
    return isPagesView.value ? pagesData : websitesData
})


async function showDetails(website: string) {
    currentWebsite.value = website;
    isPagesView.value = true;
}

async function showGeneral() {
    websitesData.execute();
    isPagesView.value = false;
}

const router = useRouter();

function goToView() {
    router.push('/dashboard/visits');
}

</script>


<template>
    <div class="flex flex-col gap-2 h-full">
        <BarCardBase :hideShowMore="true" @showGeneral="showGeneral()" @showRawData="goToView()"
            @dataReload="currentData.refresh()" @showDetails="showDetails" :data="currentData.data.value || []"
            :loading="currentData.pending.value" :label="isPagesView ? 'Top pages' : 'Top Domains'"
            :sub-label="isPagesView ? 'Page' : 'Domains'"
            :desc="isPagesView ? 'Most visited pages' : 'Most visited domains in this project'"
            :interactive="!isPagesView" :rawButton="!isLiveDemo()" :isDetailView="isPagesView">
        </BarCardBase>
    </div>
</template>
