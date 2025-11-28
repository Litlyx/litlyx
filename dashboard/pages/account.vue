<script lang="ts" setup>
import { DialogDeleteAccount } from '#components';
import { Trash } from 'lucide-vue-next';
import type { TUserMe } from '~/server/api/user/me';

const { data: me } = useAuthFetch<TUserMe>('/api/user/me');

definePageMeta({ layout: 'sidebar' });

const newPassword = ref<string>('');

const { clear } = useUserSession();
const router = useRouter();
const dialog = useDialog();

async function showDeleteAccountDialog() {
    dialog.open({
        body: DialogDeleteAccount,
        title: 'Delete account',
        async onSuccess() {
            deleteAccount();
        },
    })
}

async function deleteAccount() {
    await useCatch({
        toast: true,
        toastTitle: 'Error deleting account data',
        async action() {
            await useAuthFetchSync('/api/user/delete', { method: 'DELETE' })
        },
        async onSuccess(_, showToast) {
            showToast('Deleting scheduled', { description: 'Account deleted successfully.', position: 'top-right' })
            dialog.close();
            await clear();
            router.push('/');
        },
    })
}


</script>

<template>

    <div class="p-4 space-y-4 poppins">
<PageHeader title="Account Settings" 
description="Manage your account"/>
        <Card>
            <CardContent class="flex flex-col gap-8">

                <div class="flex flex-col">
                    <PageHeader title="Change account password"/>
                    <div v-if="!me" class="flex gap-4">
                       <p class="text-gray-500 text-sm lg:text-md dark:text-gray-400"><Loader class="size-4"/></p> 
                    </div>
                    <div v-if="me && me.email_login" class="flex gap-4">
                        <p class="text-gray-500 text-sm lg:text-md dark:text-gray-400"> You can change your password <NuxtLink to="/forgot_password"> here </NuxtLink>
                        </p>
                    </div>
                    <div v-if="me && !me.email_login">
                        <PageHeader description="You cannot change the password for accounts created using social login
                            options."/>
                    </div>
                </div>
<Separator/>
                <div class="flex justify-between items-center">
                <PageHeader title="Delete account" description="Deleting your account, Analytics, Events will be removed"/>
                    <Button @click="showDeleteAccountDialog()" variant="destructive">
                        <Trash></Trash>
                        Delete account
                    </Button>
                </div>


            </CardContent>
        </Card>
    </div>

</template>