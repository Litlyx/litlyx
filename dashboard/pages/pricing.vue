<script setup lang="ts">

definePageMeta({ layout: 'header' });

</script>


<template>

    <div class="home h-full overflow-y-auto relative">

        <div class="absolute top-0 left-0 w-full h-full flex flex-col items-center z-0 overflow-hidden">
            <HomeBgGrid :size="50" :spacing="18" opacity="0.3" class="w-fit h-fit"></HomeBgGrid>
            <HomeBgGrid :size="50" :spacing="18" opacity="0.3" class="w-fit h-fit"></HomeBgGrid>
        </div>

        <div class="flex w-full justify-center px-20">
            <SelectButton class="text-[1.4rem]" :current-index="0" :options="[
                { label: 'Monthly' },
                { label: 'Yearly' },
            ]"></SelectButton>
        </div>

        <div class="flex mt-20 gap-10 mx-20">

            <PricingCard title="Free plan" icon="far fa-fire" price="€ 54" :list="[

                { text: '3k Page visits / Custom Events (one time)', icon: 'fas fa-check' },
                { text: 'Access to Crm', icon: 'fas fa-check' },
                { text: 'Download CSV Raw data', icon: 'fas fa-check' },
                { text: 'PDF Report For investor', icon: 'fas fa-check' },

                { text: 'Team member', icon: '' },
                { text: 'Only 1 project connected', icon: '' },

            ]"></PricingCard>

            <PricingCard title="Free plan" icon="far fa-fire" price="€ 54" :list="[

                { text: '3k Page visits / Custom Events (one time)', icon: 'fas fa-check' },
                { text: 'Access to Crm', icon: 'fas fa-check' },
                { text: 'Download CSV Raw data', icon: 'fas fa-check' },
                { text: 'PDF Report For investor', icon: 'fas fa-check' },

                { text: 'Team member', icon: '' },
                { text: 'Only 1 project connected', icon: '' },

            ]"></PricingCard>

            <PricingCard title="Free plan" icon="far fa-fire" price="€ 54" :list="[

                { text: '3k Page visits / Custom Events (one time)', icon: 'fas fa-check' },
                { text: 'Access to Crm', icon: 'fas fa-check' },
                { text: 'Download CSV Raw data', icon: 'fas fa-check' },
                { text: 'PDF Report For investor', icon: 'fas fa-check' },

                { text: 'Team member', icon: '' },
                { text: 'Only 1 project connected', icon: '' },

            ]"></PricingCard>


            <PricingCard title="Free plan" icon="far fa-fire" price="€ 54" :list="[

                { text: '3k Page visits / Custom Events (one time)', icon: 'fas fa-check' },
                { text: 'Access to Crm', icon: 'fas fa-check' },
                { text: 'Download CSV Raw data', icon: 'fas fa-check' },
                { text: 'PDF Report For investor', icon: 'fas fa-check' },

                { text: 'Team member', icon: '' },
                { text: 'Only 1 project connected', icon: '' },

            ]"></PricingCard>


        </div>


        <div class="flex w-full py-20 my-20 px-20">
            <div class="flex justify-between w-full">
                <div class="flex flex-col gap-2">
                    <div class="poppins font-bold text-[2.2rem]">
                        Ready to ditch Google Analytics ?
                    </div>
                    <div class="text-accent poppins font-bold text-[2.2rem]">
                        Start your free trial today.
                    </div>
                </div>
                <div class="flex gap-4 items-center mr-20">
                    <div class="poppins px-12 py-6 text-[1.2rem] hover:bg-accent/90 text-text cursor-pointer bg-accent rounded-xl font-semibold">
                        Get started
                    </div>
                    <div class="poppins px-12 py-6 text-[1.2rem] hover:bg-text/90 cursor-pointer text-accent bg-text rounded-xl font-semibold">
                        Live demo
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
