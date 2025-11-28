<script lang="ts" setup>

definePageMeta({ layout: 'sidebar' });
const projectStore = useProjectStore();
</script>

<template>
      <Unauthorized v-if="!projectStore.isOwner" authorization="Guest user limitation">
    </Unauthorized>
    <div v-else class="p-4">

        <Label class="text-2xl"> Billing </Label>

        <div class="flex mt-12">
            <div class="flex-[2]">
                <div class="font-semibold text-lg"> Current plan </div>
                <div class="text-muted-foreground"> Manage current plan for this project </div>
            </div>

            <div class="flex-[3]">
                <BillingPlanView></BillingPlanView>
            </div>
        </div>

        <Separator class="my-8"> </Separator>

        <div class="flex mt-12">
            <div class="flex-[2]">
                <div class="font-semibold text-lg"> Usage </div>
                <div class="text-muted-foreground"> Show usage of current project </div>
            </div>

            <div class="flex-[3]">
                <BillingUsageView></BillingUsageView>
            </div>
        </div>

        <Separator class="my-8"> </Separator>


        <div v-if="!isSelfhosted()" class="flex mt-12">
            <div class="flex-[2]">
                <div class="font-semibold text-lg"> Billing address </div>
                <div class="text-muted-foreground">
                    This will be reflected in every upcoming invoice,
                    <br>
                    past invoices are not affected
                </div>
            </div>

            <div class="flex-[3]">
                <BillingAddress></BillingAddress>
            </div>
        </div>

        <Separator v-if="!isSelfhosted()" class="my-8"> </Separator>

        <div v-if="!isSelfhosted()" class="flex mt-12">
            <div class="flex-[2]">
                <div class="font-semibold text-lg"> Invoices </div>
                <div class="text-muted-foreground">
                    Visualize invoices of current project
                </div>
            </div>

            <div class="flex-[3]">
                <BillingInvoicesView></BillingInvoicesView>
            </div>
        </div>

    </div>
</template>