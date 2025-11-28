<script lang="ts" setup>

const { data: billingAddress, status: billingAddressStatus, refresh: refreshBillingAddress } = useAuthFetch('/api/user/customer');

const currentBillingAddress = ref({
    line1: '',
    line2: '',
    country: '',
    postal_code: '',
    city: '',
    state: ''
})

const canSave = computed(() => {
    if (!billingAddress.value) return false;
    if (currentBillingAddress.value.line1 !== billingAddress.value.line1) return true;
    if (currentBillingAddress.value.line2 !== billingAddress.value.line2) return true;
    if (currentBillingAddress.value.country !== billingAddress.value.country) return true;
    if (currentBillingAddress.value.postal_code !== billingAddress.value.postal_code) return true;
    if (currentBillingAddress.value.city !== billingAddress.value.city) return true;
    if (currentBillingAddress.value.state !== billingAddress.value.state) return true;
    return false;
})

watch(billingAddress, () => {
    if (!billingAddress.value) return;
    currentBillingAddress.value.line1 = billingAddress.value.line1;
    currentBillingAddress.value.line2 = billingAddress.value.line2;
    currentBillingAddress.value.country = billingAddress.value.country;
    currentBillingAddress.value.postal_code = billingAddress.value.postal_code;
    currentBillingAddress.value.city = billingAddress.value.city;
    currentBillingAddress.value.state = billingAddress.value.state;
});



async function updateCustomer() {
    await useCatch({
        toast: true,
        toastTitle: 'Error updating customer',
        async action() {
            await useAuthFetchSync('/api/user/update_customer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: currentBillingAddress.value
            });
            await refreshBillingAddress();
        },
        onSuccess(_, showToast) {
            showToast('Update success', { description: 'Customer updated successfully', position: 'top-right' })
        },
    })
}

</script>

<template>

    <div v-if="billingAddressStatus === 'success'" class="flex justify-center flex-col gap-4">

        <div class="w-full flex flex-col gap-2">
            <Input v-model="currentBillingAddress.line1" placeholder="Address line 1"></Input>
            <Input v-model="currentBillingAddress.line2" placeholder="Address line 2"></Input>
            <div class="flex gap-2">
                <Input v-model="currentBillingAddress.country" placeholder="Country"></Input>
                <Input v-model="currentBillingAddress.postal_code" placeholder="Postal code"></Input>
            </div>
            <div class="flex gap-2">
                <Input v-model="currentBillingAddress.city" placeholder="City"></Input>
                <Input v-model="currentBillingAddress.state" placeholder="State"></Input>
            </div>
        </div>

        <div class="flex justify-end">
            <Button :disabled="!canSave" @click="updateCustomer()" class="w-fit px-10"> Save </Button>
        </div>

    </div>

    <div v-else class="flex justify-center">
        <Loader></Loader>
    </div>

</template>