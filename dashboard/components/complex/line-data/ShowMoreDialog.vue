<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { IconProvider } from './LineDataTemplate.vue'

export type ShowMoreDialogProps = {
    title: string,
    sub?: string,
    items: { _id: string, count: number, avgSeconds?: number }[],
    total: any,
    iconProvider?: IconProvider,
    iconStyle?: string,
    loading: boolean
}

const props = defineProps<{ data: ShowMoreDialogProps }>();
const total = computed(() => props.data.total);

</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <slot></slot>
        </DialogTrigger>
        <DialogContent class="max-w-[90dvw] min-w-[40dvw] max-h-[90dvh] overflow-y-hidden poppins">
            <!-- sm:max-w-[425px] min-w-[40rem] -->
            <DialogHeader>
                <DialogTitle> {{ data.title }} </DialogTitle>
                <DialogDescription>
                    {{ data.sub }}
                </DialogDescription>
            </DialogHeader>
            <div class="overflow-y-auto h-100">
                <Table v-if="!data.loading">
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[90%]"> Item </TableHead>
                            <TableHead> Count </TableHead>
                            <TableHead v-if="data.items[0].avgSeconds"> Duration </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody class="w-full">
                        <TableRow v-for="item in data.items" :key="item._id">
                            <TableCell class="font-medium">
                                <div class="flex items-center gap-3">
                                    <div v-if="data.iconProvider">
                                        <img v-if="data.iconProvider(item)?.[0] === 'img'" class="h-full"
                                            :style="data.iconStyle" :src="(data.iconProvider(item)?.[1] as string)">

                                        <component v-if="data.iconProvider(item)?.[0] == 'component'" class="size-4"
                                            :is="data.iconProvider(item)?.[1]">
                                        </component>
                                    </div>

                                    <span class="max-w-96 overflow-auto">{{ item._id }}</span>
                                </div>
                            </TableCell>
                            <TableCell class="group">
                                <span class="group-hover:hidden flex">
                                    {{ formatNumberK(item.count) }}

                                </span>
                                <span class="hidden group-hover:flex "> {{ (100 / total * item.count).toFixed(1) }}%
                                </span>
                            </TableCell>
                            <TableCell>
                                <span class="text-center w-[6rem]" v-if="item.avgSeconds">
                                    {{ formatTime(item.avgSeconds * 1000, false) }}
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div v-else class="flex justify-center items-center h-full w-full">
                    <Loader />
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>