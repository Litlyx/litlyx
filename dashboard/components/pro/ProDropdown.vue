<template>
    <NuxtLink :to="isSelfhosted() ? 'https://litlyx.com/pricing-selfhosted': '/plans'" class="dark:text-violet-200 bg-violet-200 hover:!bg-violet-300/80 dark:bg-violet-500/20 hover:dark:!bg-violet-500/30">
        <Badge class="text-amber-500 bg-amber-100 dark:bg-amber-500/10 uppercase">pro</Badge>
        <div class="font-medium">
            Upgrade Plan
        </div>
    </NuxtLink>
</template>