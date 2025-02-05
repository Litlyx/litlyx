<script lang="ts" setup>

const { domainList, domain, setActiveDomain } = useDomain();

function onChange(e: string) {
    setActiveDomain(e);
}
</script>

<template>

    <USelectMenu :uiMenu="{
        select: 'bg-lyx-lightmode-widget-light !ring-lyx-lightmode-widget dark:!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter dark:!ring-lyx-widget-lighter',
        base: '!bg-lyx-lightmode-widget dark:!bg-lyx-widget w-max',
        option: {
            base: 'z-[999] hover:!bg-lyx-lightmode-widget-light dark:hover:!bg-lyx-widget-lighter cursor-pointer',
            active: '!bg-lyx-lightmode-widget-light dark:!bg-lyx-widget-lighter'
        }
    }" class="w-full" searchable v-if="domainList" @change="onChange" :value="domain" :options="domainList">

        <template #option="{ option, active, selected }">
            <div class="flex items-center gap-2">
                <div>
                    <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'" alt="Litlyx logo">
                </div>
                <div> {{ option }} </div>
            </div>
        </template>

        <template #label>
            <div class="flex items-center gap-2">
                <div>
                    <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'" alt="Litlyx logo">
                </div>
                <div>
                    {{ domain || '-' }}
                </div>
            </div>
        </template>
    </USelectMenu>

</template>