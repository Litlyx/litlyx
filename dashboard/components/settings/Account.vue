<script lang="ts" setup>
import type { SettingsTemplateEntry } from './Template.vue';

const entries: SettingsTemplateEntry[] = [
    { id: 'change_pass', title: 'Change password', text: 'Change your password' },
    { id: 'delete', title: 'Delete account', text: 'Delete your account' },
]


const { user } = useLoggedUser();
const { setToken } = useAccessToken();

const canChangePassword = useFetch('/api/user/password/can_change', {
    headers: useComputedHeaders({ useSnapshotDates: false })
});

async function deleteAccount() {
    const sure = confirm("Are you sure you want to delete this account ?");
    if (!sure) return;
    await $fetch("/api/user/delete_account", {
        ...signHeaders(),
        method: "DELETE"
    })

    setToken('');
    location.href = "/login"
}

const old_password = ref<string>("");
const new_password = ref<string>("");

const { createAlert } = useAlert()

async function changePassword() {


    try {
        const res = await $fetch("/api/user/password/change", {
            ...signHeaders({ 'Content-Type': 'application/json' }),
            method: "POST",
            body: JSON.stringify({ old_password: old_password.value, new_password: new_password.value })
        })

        if (!res) throw Error('No response');

        if (res.error) return createAlert('Error', res.message, 'far fa-triangle-exclamation', 5000);


        old_password.value = '';
        new_password.value = '';

        return createAlert('Success', 'Password changed successfully', 'far fa-circle-check', 5000);

    } catch (ex) {
        console.error(ex);
        createAlert('Error', 'Internal error', 'far fa-triangle-exclamation', 5000);
    }

}



</script>


<template>
    <SettingsTemplate :entries="entries">
        <template #change_pass>
            <div v-if="canChangePassword.data.value?.can_change">
                <div class="flex flex-col gap-4">
                    <LyxUiInput type="password" class="py-1 px-2" v-model="old_password" placeholder="Current password"></LyxUiInput>
                    <LyxUiInput type="password" class="py-1 px-2" v-model="new_password" placeholder="New password"></LyxUiInput>
                    <LyxUiButton type="primary" @click="changePassword()"> Change password </LyxUiButton>
                </div>
            </div>
            <div v-if="!canChangePassword.data.value?.can_change">
                You cannot change the password for accounts created using social login options.
            </div>
        </template>
        <template #delete>
            <div
                class="outline rounded-lg w-full px-8 py-4 flex flex-col gap-4 outline-[1px] outline-[#541c15] bg-lyx-lightmode-widget-light dark:bg-[#1e1412]">
                <div class="poppins font-semibold"> Deleting this account will also remove its projects </div>
                <div @click="deleteAccount()"
                    class="text-[#e95b61] poppins font-semibold cursor-pointer hover:text-black hover:bg-red-700 outline rounded-lg w-fit px-8 py-2 outline-[1px] outline-[#532b26] bg-lyx-lightmode-widget-light dark:bg-[#291415]">
                    Delete account
                </div>
            </div>
        </template>
    </SettingsTemplate>
</template>
