<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });

const activeProject = useActiveProject();

const columns = [
    { key: 'me', label: '' },
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    // { key: 'pending', label: 'Pending' },
]

const { data: members, refresh: refreshMembers } = useFetch('/api/project/members/list', signHeaders());

const showAddMember = ref<boolean>(false);

const addMemberEmail = ref<string>("");

async function addMember() {

    if (addMemberEmail.value.length === 0) return;

    try {

        showAddMember.value = false;

        await $fetch('/api/project/members/add', {
            method: 'POST',
            ...signHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email: addMemberEmail.value }),
            onResponseError({ request, response, options }) {
                alert(response.statusText);
            }
        });

        addMemberEmail.value = '';

        refreshMembers();

    } catch (ex: any) { }



}

</script>


<template>

    <div class="home w-full h-full px-10 lg:px-6 overflow-y-auto pb-[12rem] md:pb-0 py-2">


        <div class="flex flex-col gap-4">

            <div @click="showAddMember = !showAddMember;"
                class="flex items-center gap-2 bg-menu w-fit px-3 py-2 rounded-lg hover:bg-menu/80 cursor-pointer">
                <i class="fas fa-plus"></i>
                <div> Add member </div>
            </div>

            <div v-if="showAddMember" class="flex gap-4 items-center">
                <input v-model="addMemberEmail" class="focus:outline-none bg-menu px-4 py-1 rounded-lg" type="text"
                    placeholder="user email">
                <div @click="addMember" class="bg-menu w-fit py-1 px-4 rounded-lg hover:bg-menu/80 cursor-pointer">
                    Add
                </div>
            </div>

            <UTable :rows="members || []" :columns="columns">
                <template #me-data="e">
                    <i v-if="e.row.me" class="far fa-user"></i>
                    <i v-if="!e.row.me"></i>
                </template>
            </UTable>

        </div>

    </div>

</template>
