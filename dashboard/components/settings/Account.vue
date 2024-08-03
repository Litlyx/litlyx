<script lang="ts" setup>
import type { SettingsTemplateEntry } from './Template.vue';

const entries: SettingsTemplateEntry[] = [
    { id: 'delete', title: 'Delete account', text: 'Delete your account' },
]


const { setToken } = useAccessToken();

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

</script>


<template>
    <SettingsTemplate :entries="entries">
        <template #delete>
            <div
                class="outline rounded-lg w-full px-8 py-4 flex flex-col gap-4 outline-[1px] outline-[#541c15] bg-[#1e1412]">
                <div class="poppins font-semibold"> Deleting this account will also remove its projects </div>
                <div @click="deleteAccount()"
                    class="text-[#e95b61] poppins font-semibold cursor-pointer hover:text-black hover:bg-red-700 outline rounded-lg w-fit px-8 py-2 outline-[1px] outline-[#532b26] bg-[#291415]">
                    Delete account
                </div>
            </div>
        </template>
    </SettingsTemplate>
</template>
