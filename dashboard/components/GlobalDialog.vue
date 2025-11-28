<script setup lang="ts">

const { isOpen, data, close } = useDialog();

</script>

<template>

    <Dialog v-model:open="isOpen">
        <DialogContent v-if="data" class="sm:max-w-[425px] z-[60]">
            <DialogHeader v-if="data.title || data.description">
                <DialogTitle v-if="data.title">
                    {{ data.title }}
                </DialogTitle>
                <DialogDescription v-if="data.description">
                    {{ data.description }}
                </DialogDescription>
            </DialogHeader>
            <component :data="data.props" @confirm="data.onSuccess?.($event, close)" :is="data.body"></component>
            <DialogFooter v-if="data.footer">
                <component :is="data.footer"></component>
            </DialogFooter>
        </DialogContent>
    </Dialog>

</template>