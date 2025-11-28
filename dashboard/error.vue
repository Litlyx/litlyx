<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({ error: Object as () => NuxtError });

const colorMode = useColorMode();

const desc = computed(() => {
    if (!props.error) return 'An error occurred';
    if (props.error && props.error.data && (props.error.data as any).message) {
        return (props.error.data as any).message as string;
    }
    return props.error.message;
});

</script>

<template>
    <div class="flex justify-center h-dvh items-center poppins">
        <Card class="flex items-center justify-center min-w-[52dvw] min-h-[60dvh]">
            <CardContent class="flex flex-col gap-4 text-center m-8">
                <div class="flex justify-center">
                    <img :src="colorMode.value === 'dark' ? '/flamy-white.png' : '/flamy-black.png'"
                        class="object-contain size-16" />
                </div>
                <div>
                    <PageHeader :title="String(error?.statusCode ?? 'Error')" :description="desc" />
                </div>

                <NuxtLink to="/"><Button class="w-full">Back Home</Button></NuxtLink>
            </CardContent>
        </Card>

    </div>
</template>
