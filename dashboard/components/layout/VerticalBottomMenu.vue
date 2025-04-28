<script setup lang="ts">

import { DialogConfirmLogout } from '#components';

const router = useRouter();
const { user, isAdmin, setLoggedUser } = useLoggedUser();
const { setToken } = useAccessToken();
const selfhosted = useSelfhosted();

const modal = useModal();


function onLogout() {
    modal.open(DialogConfirmLogout, {
        onSuccess() {
            modal.close();
            console.log('LOGOUT');
            setToken('');
            setLoggedUser(undefined);
            router.push('/login');
        },
        onCancel() {
            modal.close();
        }
    })
}

const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})


const items = computed(() => {

    const slots: any = [];

    if (selfhosted === true) {
        slots.push([
            {
                label: 'Account',
                icon: 'far fa-user',
                to: '/account'
            },
        ]);
    } else {
        slots.push([
            {
                label: 'Account',
                icon: 'far fa-user',
                to: '/account'
            },
            {
                label: 'Billing',
                icon: 'far fa-wallet',
                to: '/billing'
            },
        ]);
    }


    slots.push([
        {
            label: 'Switch theme',
            icon: isDark.value ? 'far fa-sun' : 'far fa-moon',
            click: () => {
                isDark.value = !isDark.value
            }
        }
    ]);

    if (isAdmin.value === true) {
        slots.push([
            {
                label: 'Admin',
                icon: 'far fa-cat',
                to: '/admin'
            },
            {
                label: 'Logout',
                icon: 'far fa-arrow-right-from-bracket scale-x-[-100%]',
                click: () => onLogout()
            }
        ])
    } else {
        slots.push([
            {
                label: 'Logout',
                icon: 'far fa-arrow-right-from-bracket scale-x-[-100%]',
                click: () => onLogout()
            }
        ])
    }

    return slots;

});


</script>

<template>
    <UDropdown :popper="{ placement: 'top' }" class="w-full" :items="items" :ui="{
        width: 'w-[14rem]',
        strategy: 'override',
        background: 'dark:bg-lyx-background bg-lyx-lightmode-background',
        ring: 'ring-1 dark:ring-lyx-widget-lighter ring-lyx-lightmode-widget',
        item: {
            active: 'dark:text-lyx-text text-lyx-lightmode-text dark:bg-lyx-background-lighter bg-lyx-lightmode-background-light'
        }
    }">
        <div class="dark:hover:bg-lyx-widget-light hover:bg-lyx-lightmode-widget cursor-pointer px-1 py-1 rounded-lg text-lyx-lightmode-text-dark dark:text-lyx-text-dark flex items-center gap-2 w-full"
            v-if="user && user.logged && user.user">

            <div class="flex">
                <div
                    class="flex shrink-0 items-center justify-center h-6 w-6 rounded-full border-solid border-[2px] border-lyx-lightmode-widget dark:border-lyx-widget-lighter">
                    <div class="text-[.8rem] font-medium translate-y-[1px]">
                        {{ user.user.name.substring(0, 1).toUpperCase() }}
                    </div>
                </div>
            </div>

            <div class="text-[.9rem] font-medium poppins overflow-hidden text-ellipsis grow">
                {{ user.user.email }}
            </div>

            <div class="w-[2rem] text-right pr-1">
                <i class="fas fa-ellipsis-h brightness-75"></i>
            </div>

        </div>

        <template #item="e">
            <div class="flex items-center gap-3">
                <i class="text-lyx-text-darker" :class="e.item.icon"></i>
                <div>{{ e.item.label }}</div>
            </div>
        </template>
    </UDropdown>
</template>