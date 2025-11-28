<script setup lang="ts">

const { clear } = useUserSession();
const router = useRouter();

onMounted(async () => {
    await clear();
    router.push('/');
});

</script>

<template>
    <div class="flex flex-col items-center mt-[10vh]">
    </div>
</template>