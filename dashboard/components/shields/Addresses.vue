<script lang="ts" setup>
import { DialogShieldsDeleteAddress, DialogShieldsAddAddress } from '#components';

definePageMeta({ layout: 'dashboard' });

const { data: blackAddresses, refresh: refreshAddresses, pending: pendingAddresses } = useFetch('/api/shields/ip/list', {
    headers: useComputedHeaders({})
});

const toast = useToast()
const modal = useModal();

function showAddAddressModal() {
    modal.open(DialogShieldsAddAddress, {
        onSuccess: () => {
            refreshAddresses();
            modal.close();

            toast.add({
                id: 'shield_address_add_success',
                title: 'Success',
                description: 'Blacklist updated with the new address',
                timeout: 5000
            });

        },
        onCancel: () => {
            modal.close();
        }
    })
}

function showDeleteAddressModal(address: string) {
    modal.open(DialogShieldsDeleteAddress, {
        address,
        onSuccess: () => {
            refreshAddresses();
            modal.close();
            toast.add({
                id: 'shield_address_remove_success',
                title: 'Deleted',
                description: 'Blacklist address deleted successfully',
                timeout: 5000
            });

        },
        onCancel: () => {
            modal.close();
        }
    })
}

</script>

<template>

    <div class="py-4 flex">
        <LyxUiCard class="w-full mx-2">
            <div>
                <div class="text-[1.2rem] font-semibold"> IP Block List </div>
                <div class="dark:text-lyx-text-dark text-lyx-lightmode-text-dark">
                    Reject incoming traffic from specific IP addresses
                </div>
            </div>
            <LyxUiSeparator class="my-3"></LyxUiSeparator>

            <div class="flex justify-end pb-3">
                <LyxUiButton type="primary" @click="showAddAddressModal()"> Add IP Address </LyxUiButton>
            </div>

            <div class="flex justify-center pb-8 text-[1.2rem]" v-if="pendingAddresses">
                <i class="fas fa-loader animate-spin"></i>
            </div>

            <div v-if="!pendingAddresses && blackAddresses && blackAddresses.length == 0"
                class="flex flex-col items-center pb-8">
                <div>
                    No domain rules configured for this project.
                </div>
                <div class="font-semibold">
                    Traffic from all domains is currently accepted.
                </div>
            </div>

            <div v-if="!pendingAddresses && blackAddresses && blackAddresses.length > 0"
                class="grid grid-cols-[auto_auto_auto_auto] px-10">
                <div> Domain </div>
                <div class="col-span-2"> Description </div>
                <div> Actions </div>
                <LyxUiSeparator class="col-span-4 my-3"></LyxUiSeparator>
                <template v-for="entry of blackAddresses">
                    <div class="mb-2"> {{ entry.address }} </div>
                    <div class="col-span-2">{{ entry.description || 'No description' }}</div>
                    <div> <i @click="showDeleteAddressModal(entry.address)"
                            class="far fa-trash cursor-pointer hover:text-lyx-text-dark"></i> </div>
                </template>
            </div>

        </LyxUiCard>
    </div>
</template>