<script lang="ts" setup>


const limitsInfo = await useFetch("/api/project/limits_info", {
    lazy: true, headers: useComputedHeaders({ useSnapshotDates: false })
});

const { showDrawer } = useDrawer();

function goToUpgrade() {
    showDrawer('PRICING');
}

</script>


<template>
    <div v-if="limitsInfo.data.value && limitsInfo.data.value.limited"
        class="w-full bg-[#fbbf2422] p-4 rounded-lg text-[.9rem] flex items-center">
        <div class="flex flex-col grow">
            <div class="poppins font-semibold text-[#fbbf24]">
                Limit reached
            </div>
            <div class="poppins text-[#fbbf24]">
                Litlyx cannot receive new data as you reached your plan's limit. Resume all the great
                features and collect even more data with a higher plan.
            </div>
        </div>
        <div>
            <LyxUiButton type="outline" @click="goToUpgrade()"> Upgrade </LyxUiButton>
        </div>
    </div>
</template>
