<script lang="ts" setup>


export type Entry = {
    label: string,
    disabled?: boolean,
    to?: string,
    icon?: string,
    action?: () => any,
    adminOnly?: boolean,
    external?: boolean
}

export type Section = {
    title: string,
    entries: Entry[]
}

type Props = {
    sections: Section[]
}

const { isOpen, open, close, toggle } = useMenu()

const route = useRoute();
const props = defineProps<Props>();

const { isAdmin } = useUserRoles();

</script>

<template>
    <div class="w-0 md:w-[5rem] absolute top-0 md:relative h-full">
        <div @mouseover="open()" @mouseleave="close()"
            class="CVerticalNavigation absolute z-[80] bg-menu h-full overflow-hidden w-0 md:w-[5rem]"
            :class="{ '!w-[18rem] shadow-[0_0_20px_#000000] rounded-r-2xl': isOpen }">
            <div :class="{ 'w-[18rem]': isOpen }">
                <div class="flex gap-4 items-center py-6 px-[.9rem] pb-8">
                    <div class="bg-black h-[2.8rem] aspect-[1/1] flex items-center justify-center rounded-lg">
                        <img class="h-[2.4rem]" :src="'/logo.png'">
                    </div>
                    <div v-if="isOpen" class="font-bold text-[1.4rem] text-gray-300"> Litlyx </div>
                </div>

                <div class="pb-8" v-for="section of sections">

                    <div class="flex flex-col px-3 gap-2">

                        <template v-for="entry of section.entries">

                            <NuxtLink @click="entry.action?.()" :target="entry.external ? '_blank' : ''"
                                v-if="entry.to && (!entry.adminOnly || (isAdmin && !isAdminHidden))" tag="div"
                                :to="entry.to || '/'"
                                class="text-[#a3a9b6] flex w-full items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#363638] hover:text-[#ffffff]"
                                :class="{
                                    'brightness-[.4] pointer-events-none': entry.disabled,
                                    'bg-[#363638] shadow-[0px_0px_2px_#ffffff20_inset] border-[#ffffff20] border-[1px] !text-[#ffffff]': route.path == (entry.to || '#')
                                }">
                                <div class="flex items-center text-[1.4rem] w-[1.8rem] justify-center">
                                    <i :class="entry.icon"></i>
                                </div>
                                <div v-if="isOpen" class="text-[.9rem] font-bold manrope"> {{ entry.label }} </div>
                            </NuxtLink>

                            <div v-if="!entry.to" @click="entry.action?.()"
                                class="text-[#a3a9b6] flex w-full items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#363638] hover:text-[#ffffff]">
                                <div class="flex items-center text-[1.4rem] w-[1.8rem] justify-center">
                                    <i :class="entry.icon"></i>
                                </div>
                                <div v-if="isOpen" class="text-[.9rem] font-bold manrope"> {{ entry.label }} </div>
                            </div>

                        </template>

                    </div>

                </div>

            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.CVerticalNavigation {
    transition: all .25s ease-in-out;
}

.CVerticalNavigation * {
    font-family: 'Inter';
}

input:focus {
    outline: none;
}
</style>