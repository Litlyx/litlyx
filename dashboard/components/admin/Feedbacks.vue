<script lang="ts" setup>

const { data: feedbacks, pending: pendingFeedbacks } = useFetch<any[]>(() => `/api/admin/feedbacks`, signHeaders());

</script>

<template>
    <div class="mt-6 h-full">

        <div
            class="cursor-default flex justify-center flex-wrap gap-6 mb-[4rem] mt-4 overflow-auto h-full pt-6 pb-[8rem]">

            <div v-if="feedbacks" class="flex flex-col-reverse gap-4 px-20">
                <div class="flex flex-col text-center outline outline-[1px] outline-lyx-widget-lighter p-4 gap-2"
                    v-for="feedback of feedbacks">
                    <div class="flex flex-col gap-1">
                        <div class="text-lyx-text-dark"> {{ feedback.user[0]?.email || 'DELETED USER' }} </div>
                        <div class="text-lyx-text-dark"> {{ feedback.project[0]?.name || 'DELETED PROJECT' }} </div>
                    </div>
                    {{ feedback.text }}
                </div>
            </div>


            <div v-if="pendingFeedbacks"> Loading...</div>

        </div>
    </div>
</template>

<style scoped lang="scss"></style>