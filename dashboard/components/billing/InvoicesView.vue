<script lang="ts" setup>
import { FileIcon, FileCheck } from 'lucide-vue-next';

const { data: invoices, status: invoicesStatus } = useAuthFetch('/api/user/invoices');

</script>

<template>

    <div class="flex justify-center">
        <Card class="w-full" v-if="invoicesStatus === 'success' && invoices">
            <CardContent class="flex flex-col gap-4">

                <Table>
                    <TableHeader>
                        <TableRow class="*:text-center">
                            <TableHead class="w-[5%]"></TableHead>
                            <TableHead class="w-fit"> Date </TableHead>
                            <TableHead class="w-fit"> Price </TableHead>
                            <TableHead class="w-fit"> Number </TableHead>
                            <TableHead class="w-fit"> Status </TableHead>
                            <TableHead class="w-fit"> Actions </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="invoice of invoices.data" class="h-[2rem]">
                            <TableCell>
                                <FileCheck class="size-4"></FileCheck>
                            </TableCell>
                            <TableCell>
                                {{ new Date(invoice.created * 1000).toLocaleString() }}
                            </TableCell>
                            <TableCell>
                                € {{ invoice.amount_due / 100 }}
                            </TableCell>
                            <TableCell>
                                {{ invoice.number }}
                            </TableCell>
                            <TableCell>
                                <Badge :class="{
                                    'bg-red-300': invoice.status === 'open'
                                }">
                                    {{ invoice.status }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <NuxtLink target="_blank" :to="invoice.hosted_invoice_url ?? '#'">
                                    <Button variant="ghost">
                                        <FileIcon></FileIcon>
                                        Manage
                                    </Button>
                                </NuxtLink>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <div v-else class="flex justify-center">
            <Loader></Loader>
        </div>
    </div>

</template>