<script lang="ts" setup>
import { DialogShieldsAddDomain, DialogShieldsDeleteDomain } from '#components';
import { TrashIcon } from 'lucide-vue-next';

const { data: domains, refresh: domainsRefresh, status: domainsStatus } = useAuthFetch('/api/shields/domains/list');

const dialog = useDialog();

function showDeleteDomainDialog(domain: string) {
    dialog.open({
        body: DialogShieldsDeleteDomain,
        props: { domain },
        async onSuccess(_, close) {
            await deleteDomain(domain);
            close();
        },
    })
}

async function deleteDomain(domain: string) {
    await useCatch({
        toast: true,
        toastTitle: 'Error deleting domain',
        async action() {
            await useAuthFetchSync('/api/shields/domains/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: { domain }
            })
        },
        onSuccess(_, showToast) {
            showToast('Domain deleted', { description: 'Domain deleted successfully', position: 'top-right' });
            domainsRefresh();
        },
    })
}

function showAddDomainDialog() {
    dialog.open({
        body: DialogShieldsAddDomain,
        async onSuccess(data, close) {
            await addDomain(data);
            close();
        },
    })
}

async function addDomain(domain: string) {
    await useCatch({
        toast: true,
        toastTitle: 'Error adding domain',
        async action() {
            await useAuthFetchSync('/api/shields/domains/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { domain }
            })
        },
        onSuccess(_, showToast) {
            showToast('Domain added', { description: 'Domain added successfully', position: 'top-right' });
            domainsRefresh();
        },
    })
}

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle> Domains allow list </CardTitle>
            <CardDescription> Accept incoming traffic only from familiar domains. </CardDescription>
            <CardAction>
                <Button @click="showAddDomainDialog"> Add domain </Button>
            </CardAction>
        </CardHeader>
        <CardContent>

            <div v-if="!domains || domainsStatus !== 'success'" class="flex justify-center my-8">
                <Loader></Loader>
            </div>

            <div v-if="domains && domains.length == 0 && domainsStatus === 'success'"
                class="flex flex-col items-center mt-8 text-sm">
                <div class="poppins"> No domain rules configured for this project. </div>
                <div class="font-bold poppins"> Traffic from all domains is currently accepted. </div>
            </div>

            <Table v-if="domains && domains.length > 0 && domainsStatus === 'success'">
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-full"> Domain </TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="domain in domains">
                        <TableCell class="font-medium">
                            {{ domain }}
                        </TableCell>
                        <TableCell>
                            <TrashIcon @click="showDeleteDomainDialog(domain)" class="size-4 cursor-pointer">
                            </TrashIcon>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </CardContent>
    </Card>
</template>