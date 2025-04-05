<script lang="ts" setup>


const { showDrawer } = useDrawer();

function goToUpgrade() {
    showDrawer('PRICING');
}

const { isPremium } = useLoggedUser()

</script>


<template>
    <div v-if="!isPremium" class="w-full bg-[#5680f822] p-4 rounded-lg text-[.9rem] flex items-center">
        <div class="flex flex-col grow">
            <div class="poppins font-semibold text-lyx-primary">
                Launch offer: 25% off forever with code <span class="text-white font-bold text-[1rem]">LIT25</span> at
                checkout
                from Acceleration Plan and beyond.
            </div>
            <!-- <div class="poppins text-lyx-primary">
                We're offering an exclusive 25% discount forever on all plans starting from the Acceleration
                Plan for our first 100 users who believe in our project.
                <br>
                Redeem Code: <span class="text-white font-bold text-[1rem]">LIT25</span> at checkout to
                claim your discount.
            </div> -->
        </div>
        <div>
            <LyxUiButton type="outline" @click="goToUpgrade()"> Upgrade </LyxUiButton>
        </div>
    </div>
</template>
