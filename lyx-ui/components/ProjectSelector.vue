<script lang="ts" setup>


</script>

<template>
    <LyxUiCard>
        <div class="flex items-center">
            <div class="grow">
                PROJECT_NAME
            </div>
            <div>
                Active
            </div>
            <LyxUiIcon icon="drag_indicator"></LyxUiIcon>
        </div>
        <div class="flex items-center">
            <LyxUiButton type="primary">
                CURRENT_SUBSCRIPTION
            </LyxUiButton>
            <div class="poppins font-light text-lyx-text-dark">
                next billing: NEXT_BILLING_DATE
            </div>
        </div>
    </LyxUiCard>
</template>