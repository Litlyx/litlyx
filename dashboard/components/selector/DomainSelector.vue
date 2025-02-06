<script lang="ts" setup>

const { domainList, domain, setActiveDomain, refreshDomains, refreshingDomains } = useDomain();

function onChange(e: string) {
    setActiveDomain(e);
}
</script>

<template>
    <div class="flex gap-2">
        <USelectMenu :uiMenu="{
            select: 'bg-lyx-lightmode-widget-light !ring-lyx-lightmode-widget dark:!bg-lyx-widget-light !shadow-none focus:!ring-lyx-widget-lighter dark:!ring-lyx-widget-lighter',
            base: '!bg-lyx-lightmode-widget dark:!bg-lyx-widget w-max',
            option: {
                base: 'z-[990] hover:!bg-lyx-lightmode-widget-light dark:hover:!bg-lyx-widget-lighter cursor-pointer',
                active: '!bg-lyx-lightmode-widget-light dark:!bg-lyx-widget-lighter'
            },
            input: 'z-[999] !bg-lyx-lightmode-widget dark:!bg-lyx-widget-light'
        }" class="w-full" searchable searchable-placeholder="Search domain..." v-if="domainList" @change="onChange"
            :value="domain" value-attribute="_id" :options="domainList">

            <template #option="{ option, active, selected }">
                <div class="flex items-center gap-2">
                    <div>
                        <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'" alt="Litlyx logo">
                    </div>
                    <div> {{ option._id }} </div>
                </div>
            </template>

            <template #label="e">
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
        <div @click="refreshDomains" v-if="!refreshingDomains"
            class="flex items-center hover:rotate-[60deg] transition-all duration-200 ease-in-out cursor-pointer">
            <i class="far fa-refresh"></i>
        </div>
    </div>
</template>