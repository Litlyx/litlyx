<script setup lang="ts">

import ActionableChart from '~/components/complex/ActionableChart.vue';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import GuidedSetup from '~/components/complex/GuidedSetup.vue';
import LineDataNew from '~/components/complex/LineDataNew.vue';
import { RefreshCwIcon } from 'lucide-vue-next';

definePageMeta({ layout: 'sidebar' });


const projectStore = useProjectStore();

const { insight, insightRefresh, insightStatus } = useInsight();


</script>

<template>


    <Unauthorized v-if="projectStore.permissions?.webAnalytics === false" authorization="webAnalytics">
    </Unauthorized>

    <div v-if="projectStore.permissions?.webAnalytics && !projectStore.firstInteraction && !isSelfhosted()">
        <GuidedSetup />
    </div>

    <div v-else class="flex flex-col gap-4 poppins">



        <Card v-if="!isSelfhosted()">
            <CardContent class="flex items-center">
                <img class="w-5 h-auto mr-4" :src="'ai/pixel-boy.png'">
                <div v-if="insightStatus === 'success'"> {{ insight }} </div>
                <div v-else> Generating your insight... </div>
                <div class="grow"></div>
                <RefreshCwIcon v-if="insightStatus === 'success'" @click="insightRefresh()"
                    class="size-5 hover:rotate-45 transition-all duration-150"></RefreshCwIcon>
            </CardContent>
        </Card>


        <Accordion type="single" collapsible class="relative lg:hidden border rounded-xl px-5 bg-card">

            <AccordionItem value=" top-cards">

                <AccordionTrigger class="text-md">
                    Top Charts
                </AccordionTrigger>
                <AccordionContent>
                    <DashboardTopCards class="grid grid-cols-2" />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        <div class="hidden lg:block">
            <DashboardTopCards />
        </div>



         <ActionableChart></ActionableChart>

        <div class="flex w-full justify-center">
            <div class="flex w-full gap-4 flex-col xl:flex-row">
                <LineDataNew class="flex-1" type="referrers" select />
                <LineDataNew class="flex-1" type="pages" select />
            </div>
        </div>

        <div class="flex w-full justify-center">
            <div class="flex w-full gap-4 flex-col xl:flex-row">
                <LineDataNew class="flex-1" type="countries" select />
                <LineDataNew class="flex-1" type="devices" select />
            </div>
        </div>

    </div>
</template>
