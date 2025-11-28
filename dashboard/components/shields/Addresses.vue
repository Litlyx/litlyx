<script lang="ts" setup>
import { DialogShieldsAddAddress, DialogShieldsDeleteAddress } from '#components';
import { TrashIcon } from 'lucide-vue-next';

const { data: addresses, refresh: addressesRefresh, status: addressesStatus } = useAuthFetch('/api/shields/addresses/list');

const dialog = useDialog();

function showDeleteAddressDialog(address: string) {
    dialog.open({
        body: DialogShieldsDeleteAddress,
        props: { domain: address },
        async onSuccess(_, close) {
            await deleteAddress(address);
            close();
        },
    })
}

async function deleteAddress(address: string) {
    await useCatch({
        toast: true,
        toastTitle: 'Error deleting domain',
        async action() {
            await useAuthFetchSync('/api/shields/addresses/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: { address }
            })
        },
        onSuccess(_, showToast) {
            showToast('Address deleted', { description: 'Address deleted successfully', position: 'top-right' });
            addressesRefresh();
        },
    })
}

function showAddAddressDialog() {
    dialog.open({
        body: DialogShieldsAddAddress,
        async onSuccess(data, close) {
            await addAddress(data);
            close();
        },
    })
}

async function addAddress(data: { address: string, description: string }) {
    await useCatch({
        toast: true,
        toastTitle: 'Error adding domain',
        async action() {
            await useAuthFetchSync('/api/shields/addresses/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: data
            })
        },
        onSuccess(_, showToast) {
            showToast('Address added', { description: 'Address added successfully', position: 'top-right' });
            addressesRefresh();
        },
    })
}

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle> IP Block List </CardTitle>
            <CardDescription> Reject incoming traffic from specific IP addresses. </CardDescription>
            <CardAction>
                <Button @click="showAddAddressDialog"> Add IP address </Button>
            </CardAction>
        </CardHeader>
        <CardContent>

            <div v-if="!addresses || addressesStatus !== 'success'" class="flex justify-center my-8">
                <Loader></Loader>
            </div>

            <div v-if="addresses && addresses.length == 0 && addressesStatus === 'success'"
                class="flex flex-col items-center mt-8 text-sm">
                <div class="poppins"> No IP address rules configured for this project. </div>
                <div class="font-bold poppins"> Traffic from all IP addresses is currently accepted. </div>
            </div>

            <Table v-if="addresses && addresses.length > 0 && addressesStatus === 'success'">
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[20%]"> Address </TableHead>
                        <TableHead class="w-full"> Description </TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="item in addresses">
                        <TableCell class="font-medium">
                            {{ item.address }}
                        </TableCell>
                        <TableCell class="font-medium">
                            {{ item.description ?? 'No description' }}
                        </TableCell>
                        <TableCell>
                            <TrashIcon @click="showDeleteAddressDialog(item.address)" class="size-4 cursor-pointer">
                            </TrashIcon>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </CardContent>
    </Card>
</template>