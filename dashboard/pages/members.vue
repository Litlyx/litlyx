<script setup lang="ts">
import { DialogPermissionManager } from '#components';
import type { TPermission } from '~/shared/schema/TeamMemberSchema';

const { projectId, isGuest } = useProject();

definePageMeta({ layout: 'dashboard' });

const columns = [
    { key: 'me', label: '' },
    { key: 'email', label: 'Email' },
    { key: 'permission', label: 'Permission' },
    { key: 'pending', label: 'Status' },
    { key: 'action', label: 'Actions' },
]

const { data: members, refresh: refreshMembers } = useFetch('/api/project/members/list', {
    headers: useComputedHeaders({ useSnapshotDates: false })
});

const showAddMember = ref<boolean>(false);

const addMemberEmail = ref<string>("");

async function kickMember(email: string) {
    const sure = confirm('Are you sure to kick ' + email + ' ?');
    if (!sure) return;
    try {
        await $fetch('/api/project/members/kick', {
            method: 'POST',
            ...signHeaders({
                'Content-Type': 'application/json',
                'x-pid': projectId.value ?? ''
            }),
            body: JSON.stringify({ email }),
            onResponseError({ request, response, options }) {
                alert(response.statusText);
            }
        });

        refreshMembers();
    } catch (ex: any) { }
}

async function addMember() {

    if (addMemberEmail.value.length === 0) return;

    try {

        showAddMember.value = false;

        await $fetch('/api/project/members/add', {
            method: 'POST',
            ...signHeaders({
                'Content-Type': 'application/json',
                'x-pid': projectId.value ?? ''
            }),
            body: JSON.stringify({ email: addMemberEmail.value }),
            onResponseError({ request, response, options }) {
                alert(response.statusText);
            }
        });

        addMemberEmail.value = '';

        refreshMembers();

    } catch (ex: any) { }


}


const modal = useModal();

function openPermissionManagerDialog(member_id: string) {
    modal.open(DialogPermissionManager, {
        preventClose: true,
        member_id,
        onSuccess: () => {
            modal.close();
            refreshMembers();
        },
        onCancel: () => {
            modal.close();
            refreshMembers();
        },
    });
}

function permissionToString(permission: TPermission) {
    const result: string[] = [];
    if (permission.webAnalytics) result.push('w');
    if (permission.events) result.push('e');
    if (permission.ai) result.push('a');
    if (permission.domains.includes('All domains')) {
        result.push('+');
    } else {
        result.push(permission.domains.length.toString());
    }
    return result.join('');
}
</script>

<template>
    <div class="p-6 pt-10">

        <div class="flex flex-col gap-8">

            <div class="flex flex-col">
                <div class="flex gap-4 items-center">
                    <LyxUiInput class="px-4 py-1 w-full" placeholder="Add a new member" v-model="addMemberEmail">
                    </LyxUiInput>
                    <LyxUiButton @click="addMember" type="secondary"> Add </LyxUiButton>
                </div>
                <div class="poppins text-[.8rem] mt-2 text-lyx-text-darker">
                    User should have been registered to Litlyx
                </div>
            </div>

            <div>
                <UTable :rows="members || []" :columns="columns">

                    <template #me-data="e">
                        <i v-if="e.row.me" class="far fa-user text-lyx-lightmode-text dark:text-lyx-text"></i>
                        <i v-if="!e.row.me"></i>
                    </template>

                    <template #email-data="e">
                        <div class="text-lyx-lightmode-text dark:text-lyx-text">
                            {{ e.row.email }}
                        </div>
                    </template>

                    <template #pending-data="e">
                        <div class="text-lyx-lightmode-text dark:text-lyx-text">
                            {{ e.row.pending ? 'Pending' : 'Ok' }}
                        </div>
                    </template>

                    <template #permission-data="e">
                        <div class="text-lyx-lightmode-text dark:text-lyx-text flex gap-2">
                            <div v-if="e.row.role !== 'OWNER' && !isGuest">
                                <LyxUiButton class="!px-2" type="secondary"
                                    @click="openPermissionManagerDialog(e.row.id.toString())">
                                    <i class="far fa-gear"></i>
                                </LyxUiButton>
                            </div>

                            <div class="flex gap-2 flex-wrap">
                                <UBadge variant="outline" size="sm" v-if="e.row.permission.webAnalytics"
                                    label="Analytics"> </UBadge>
                                <UBadge variant="outline" size="sm" v-if="e.row.permission.events" label="Events">
                                </UBadge>
                                <UBadge variant="outline" size="sm" v-if="e.row.permission.ai" label="AI"> </UBadge>
                                <UBadge variant="outline" color="blue" size="sm"
                                    v-if="e.row.permission.domains.includes('All domains')" label="All domains">
                                </UBadge>

                                <UBadge variant="outline" size="sm" color="blue"
                                    v-if="!e.row.permission.domains.includes('All domains')"
                                    v-for="domain of e.row.permission.domains" :label="domain"> </UBadge>


                            </div>
                        </div>
                    </template>


                    <template #action-data="e" v-if="!isGuest">
                        <div @click="kickMember(e.row.email)" v-if="e.row.role != 'OWNER'"
                            class="text-red-500 hover:bg-black/20 cursor-pointer outline outline-[1px] outline-red-500 px-3 py-1 rounded-lg text-center">
                            Kick
                        </div>
                    </template>

                </UTable>

            </div>

        </div>


    </div>
</template>
