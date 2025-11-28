<script setup lang="ts">

import { DialogManagePermissions } from '#components';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Settings, TrashIcon, UserIcon, UserPlus, UserX } from 'lucide-vue-next';
import KickUser from '~/components/dialog/KickUser.vue';
import type { MemberWithPermissions } from '~/server/api/members/list';
import type { TPermission } from '~/shared/schema/TeamMemberSchema';

const projectStore = useProjectStore();

definePageMeta({ layout: 'sidebar' });

const { data: members, error: membersError, refresh: membersRefresh } = useAuthFetch<MemberWithPermissions[]>('api/members/list');

const premium = usePremiumStore();
const dialog = useDialog();
const open = ref<boolean>(false);

async function kickUser(email: string) {
    open.value = false;
    dialog.open({
        body: KickUser,
        title: 'Remove User from Workspace',
        props: {
            email
        },
        async onSuccess(data, close) {
            await useCatch({
                toast: true,
                async action() {
                    return await useAuthFetchSync<void>('/api/members/kick', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: { email }
                    });
                },
                async onSuccess(_, toast) {
                    toast('Member kicked', { description: 'Member kicked successfully', position: 'top-right' });
                    await membersRefresh();
                }
            });

            close();
        }
    })
}

const email = ref<string>('');

async function addUser() {

    await useCatch({
        toast: true,
        async action() {
            return await useAuthFetchSync<void>('/api/members/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { email: email.value }
            });
        },
        async onSuccess(_, toast) {
            toast('Member invited', { description: 'Member invited successfully', position: 'top-right' });
            await membersRefresh();
            email.value = '';
        }
    });

}


async function showManagePermission(member: MemberWithPermissions) {
    dialog.open({
        body: DialogManagePermissions,
        props: { member },
        title: 'Manage permissions',
        description: 'Choose what this member can do on this project.',
        onSuccess(data, close) {
            editPermissions(member, data);
            close();
        },
    })
}

async function editPermissions(member: MemberWithPermissions, permissions: TPermission) {
    await useCatch({
        toast: true,
        async action() {
            return await useAuthFetchSync<void>('/api/members/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { member_id: member.id, ...permissions }
            });
        },
        async onSuccess(_, toast) {
            toast('Permissions updated', { description: 'Permissions updated successfully', position: 'top-right' });
            await membersRefresh();
        }
    });
}

</script>

<template>

    <Unauthorized v-if="projectStore.isActiveProjectGuest || [0, 7006, 8001, 8002].includes(premium.planInfo?.ID ?? -1)" authorization="PLAN or AUTH">
    </Unauthorized>

    <div v-else class="flex flex-col gap-2 poppins">


        <Card>
            <CardHeader>
                <CardTitle>
                    Workspace Members <span class="text-[10px] text-muted-foreground">({{`${members?.length ?? 0}/${premium.planInfo?.features.members}`  }})</span>
                </CardTitle>
                <CardDescription>
                    Manage the members of your workspace
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="flex flex-col">
                    <div class="flex items-center gap-4">
                        <Input v-model="email" placeholder="Email"></Input>
                        <ProButton @action="addUser()" v-if="members" :disabled="email.length < 5" title="Add Member"
                            :locked="members.length >= (premium.planInfo?.features.members ?? 0)">
                            <UserPlus />
                        </ProButton>
                    </div>
                    <div class="poppins text-[.8rem] text-muted-foreground pl-1 pt-[.5rem]">
                        We will send an invitation email to the user you wish to add to this project.
                    </div>
                </div>

                <div class="my-15"></div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[5%]"> </TableHead>
                            <TableHead class="w-[25%]"> Email </TableHead>
                            <TableHead class="w-[20%]">Pemissions</TableHead>
                            <TableHead class="w-[35%]"> Domains </TableHead>
                            <TableHead class="w-[8%]">Status</TableHead>
                            <TableHead class="w-[12%]"> Actions </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="member of members" class="h-[2rem]">
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <UserIcon class="size-4" v-if="member.me"></UserIcon>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>Owner</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                            <TableCell>
                                {{ member.email }}
                            </TableCell>
                            <TableCell>
                                <div class="flex gap-4">
                                    <div class="flex items-center gap-[.3rem]">
                                        <div :class="{ 'bg-green-400': member.permission.webAnalytics, 'bg-red-400': !member.permission.webAnalytics }"
                                            class="size-3 mt-[2px] rounded-full"></div>
                                        <div> web </div>
                                    </div>
                                    <div class="flex items-center gap-[.3rem]">
                                        <div :class="{ 'bg-green-400': member.permission.events, 'bg-red-400': !member.permission.events }"
                                            class="size-3 mt-[2px] rounded-full"></div>
                                        <div> events </div>
                                    </div>
                                    <div class="flex items-center gap-[.3rem]">
                                        <div :class="{ 'bg-green-400': member.permission.ai, 'bg-red-400': !member.permission.ai }"
                                            class="size-3 mt-[2px] rounded-full"></div>
                                        <div> ai </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div v-if="member.permission.domains.includes('*')"
                                    class="border-solid border-[2px] w-fit rounded-md px-2 py-[.2rem]">
                                    ALL DOMAINS
                                </div>
                                <div v-else-if="Array.isArray(member.permission.domains) && member.permission.domains.length === 0"
                                    class="border-dashed border-[2px] w-fit rounded-md px-2 py-[.2rem]">
                                    NO DOMAINS
                                </div>
                                <div v-else class="flex gap-2 flex-wrap">
                                    <div v-for="domain of member.permission.domains"
                                        class="border-solid border-[2px] w-fit rounded-md px-2 py-[.2rem]">
                                        {{ domain }}
                                    </div>
                                </div>

                            </TableCell>
                            <TableCell>
                                <Badge class="w-full" v-if="!member.me"
                                    :class="member.pending ? 'border-amber-400 bg-amber-300 text-amber-800' : 'border-green-400 bg-green-300 text-green-800'">
                                    {{ member.pending ? 'Pending' : 'Accepted' }}</Badge>
                            </TableCell>
                            <TableCell class="flex gap-2">
                                <TooltipProvider >
                                    <Tooltip v-if="!member.me && member.role === 'GUEST'">
                                        <TooltipTrigger> <Button @click="showManagePermission(member)" class="size-7"
                                                size="icon" variant="outline">
                                                <Settings class="size-4" />

                                            </Button></TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            <p>Manage permissions</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider v-if="!member.me">
                                    <Tooltip>
                                        <TooltipTrigger> <Button @click="kickUser(member.email)" class="size-7"
                                                size="icon" variant="destructive">
                                                <UserX class="size-4" />

                                            </Button></TooltipTrigger>
                                        <TooltipContent side="bottom">
                                            <p>Remove from Workspace</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    </div>

</template>
