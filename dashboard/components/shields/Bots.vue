<script lang="ts" setup>
import { toast } from 'vue-sonner'
import { Bot } from 'lucide-vue-next'
const { data: botOptions, refresh: botOptionsRefresh, status: botOptionsStatus } = useAuthFetch('/api/shields/bots/options');

watch(botOptions, () => {
    if (!botOptions.value) return;
    currentValue.value = botOptions.value.block;
})

const currentValue = ref<boolean>(true);

function onSwitchChange(newValue: boolean) {
    useAuthFetchSync('/api/shields/bots/update_options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { block: currentValue.value }
    }).then(() => {
        toast('Bot protection', { description: `Bot traffic has been set to ${currentValue.value === true ? 'Active' : 'Inactive'}.`, position: 'top-right' });
    })
}
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle class="flex gap-4 items-center">
                <Switch v-if="botOptionsStatus === 'success' && botOptions" v-model="currentValue"
                    @update:modelValue="onSwitchChange" />
                <Loader v-else class="!size-8"></Loader>
                Block bot traffic 
                <Badge :class="currentValue ? 'border-green-400 bg-green-300 text-green-800':'border-red-400 bg-red-300 text-red-800'">{{ currentValue ? 'Active' : 'Inactive' }}</Badge>
            </CardTitle>
            <CardDescription>
                Automatically block unwanted bot and crawler traffic to protect your site from
                spam, scrapers, and unnecessary server load.
            </CardDescription>
            <CardAction>
                <NuxtLink to="bots.txt" target="_blank">
                    <Button variant="outline">
                        <Bot class="size-4" />
                        Show bot list
                    </Button>
                </NuxtLink>
            </CardAction>
        </CardHeader>
        <CardContent>
            <div class="flex gap-2 items-center">
            </div>
        </CardContent>
    </Card>
</template>