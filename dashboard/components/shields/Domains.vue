<script lang="ts" setup>
import { DialogShieldsAddDomain, DialogShieldsDeleteDomain } from '#components';

definePageMeta({ layout: 'dashboard' });

const { data: allowedDomains, refresh: refreshDomains, pending: pendingDomains } = useFetch('/api/shields/domains/list', {
    headers: useComputedHeaders({})
});

const toast = useToast()
const modal = useModal();

function showAddDomainModal() {
    modal.open(DialogShieldsAddDomain, {
        onSuccess: () => {
            refreshDomains();
            modal.close();

            toast.add({
                id: 'shield_domain_add_success',
                title: 'Success',
                description: 'Whitelist updated with the new domain',
                timeout: 5000
            });

        },
        onCancel: () => {
            modal.close();
        }
    })
}

function showDeleteDomainModal(domain: string) {
    modal.open(DialogShieldsDeleteDomain, {
        domain,
        onSuccess: () => {
            refreshDomains();
            modal.close();
            toast.add({
                id: 'shield_domain_remove_success',
                title: 'Deleted',
                description: 'Whitelist domain deleted successfully',
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
                <div class="text-[1.2rem] font-semibold"> Domains allow list </div>
                <div class="dark:text-lyx-text-dark text-lyx-lightmode-text-dark">
                    Accept incoming traffic only from familiar domains.
                </div>
            </div>
            <LyxUiSeparator class="my-3"></LyxUiSeparator>

            <div class="flex justify-end pb-3">
                <LyxUiButton type="primary" @click="showAddDomainModal()"> Add Domain </LyxUiButton>
            </div>

            <div class="flex justify-center pb-8 text-[1.2rem]" v-if="pendingDomains">
                <i class="fas fa-loader animate-spin"></i>
            </div>

            <div v-if="!pendingDomains && allowedDomains && allowedDomains.length == 0"
                class="flex flex-col items-center pb-8">
                <div>
                    No domain rules configured for this project.
                </div>
                <div class="font-semibold">
                    Traffic from all domains is currently accepted.
                </div>
            </div>

            <div v-if="!pendingDomains && allowedDomains && allowedDomains.length > 0"
                class="grid grid-cols-[auto_auto_auto_auto] px-10">
                <div class="col-span-3">Domain</div>
                <div>Actions</div>
                <LyxUiSeparator class="col-span-4 my-3"></LyxUiSeparator>
                <template v-for="domain of allowedDomains">
                    <div class="col-span-3 mb-3">{{ domain }}</div>
                    <div> <i @click="showDeleteDomainModal(domain)"
                            class="far fa-trash cursor-pointer hover:text-lyx-text-dark"></i> </div>
                </template>
            </div>

        </LyxUiCard>
    </div>
</template>