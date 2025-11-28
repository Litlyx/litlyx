<script setup lang="ts">
import { DialogDangerGeneric } from '#components';
import { Copy, Trash, Lock } from 'lucide-vue-next';
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'sidebar' });

const projectStore = useProjectStore();
const premiumStore = usePremiumStore();

const { data: links, refresh: linksRefresh } = useAuthFetch('/api/share/list');
const { data: domains } = useAuthFetch('/api/domains/list')

const { open } = useDialog()


const hostname = computed(() => {
    if (location.protocol === 'https') {
        return `${location.protocol}//${location.hostname}`;
    } else {
        return `${location.protocol}//${location.hostname}:${location.port}`;
    }

});

function copyLink(link: string) {
    if (!navigator.clipboard) return alert('Error with clipboard.');
    navigator.clipboard.writeText(link);
    toast('Link copied', { description: 'The link is now on your clipboard', position: 'top-right' });
}

function deleteLink(id: string) {
    open({
        body: DialogDangerGeneric,
        title: 'Are you sure ?',
        async onSuccess(data, close) {
            await useAuthFetchSync(`/api/share/delete?id=${data.id}`, {
                method: 'DELETE'
            });
            close();
            linksRefresh();
            toast('Link deleted', { description: 'Link deleted successfully', position: 'top-right' });
        },
        props: {
            label: 'Are you sure to delete the link ?',
            metadata: {
                id
            }
        }
    })
}

const linkPassword = ref<string>("");
const linkDomain = ref<string>("*");
const linkDesc = ref<string>("");
const linkPublic = ref<boolean>(true);
const creating = ref<boolean>(false);

const canCreate = computed(() => {
    if (linkDesc.value.length > 250) return false;
    if (linkPublic.value === false && linkPassword.value.length < 3) return false;
    return true;
});

async function createLink() {
    creating.value = true;
    await useCatch({
        async action() {
            await useAuthFetchSync('/api/share/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { isPublic: linkPublic.value, password: linkPassword.value, description: linkDesc.value, domain: linkDomain.value }
            });
        },
        toast: true,
        toastTitle: 'Error creating link',
        onSuccess(_, showToast) {
            linkPassword.value = '';
            linkDomain.value = '*';
            linkDesc.value = '';
            linkPublic.value = true;
            showToast('Link created successfully', {});
            linksRefresh();
        },
    });
    creating.value = false;
}

</script>

<template>
    <Unauthorized v-if="projectStore.isActiveProjectGuest" authorization="OWNER">
    </Unauthorized>

    <div v-else class="flex flex-col gap-2 poppins">

        <Card v-if="links">
            <CardHeader>
                <CardTitle>
                    Shared links
                    <span class="text-[10px] text-muted-foreground">
                        {{ links.length }}
                    </span>
                </CardTitle>
                <CardDescription>
                    Manage all shared links within your workspace
                </CardDescription>
            </CardHeader>
            <CardContent>


                <!--  -->
                <div class="flex justify-center">
                    <div v-if="domains" class="p-4 flex flex-col gap-3 w-[20rem]">
                        <Label> Create new shareable link </Label>
                        <Select v-model="linkDomain">
                            <SelectTrigger class="w-full">
                                <SelectValue class="w-full" placeholder="Select a domain">
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="domain of domains" :value="domain._id">
                                        {{ domain.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div v-if="![0, 7006, 8001, 8002, 8003, 8004].includes(premiumStore.planInfo?.ID ?? -1)"
                            class="flex items-center gap-2">
                            <Switch v-model="linkPublic"></Switch>
                            <Label> {{ linkPublic ? 'Public' : 'Protected' }} link</Label>
                        </div>
                        <div v-else >
                            <Tooltip>
                                <TooltipTrigger class="flex items-center  gap-2">
                                    <Switch :model-value="true" disabled></Switch>
                                    <Label> Public
                                        <Lock class="size-4 text-yellow-500" />
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Pro feature</p>
                                </TooltipContent>
                            </Tooltip>


                        </div>
                        <Label v-if="!linkPublic"> Password </Label>
                        <CustomPasswordInput v-if="!linkPublic" v-model="linkPassword">
                        </CustomPasswordInput>
                        <label>Description</label>
                        <Input v-model="linkDesc" placeholder="Description"></Input>
                        <Button @click="createLink()" v-if="!creating" :disabled="!canCreate">
                            Create link </Button>
                        <Button v-else disabled>
                            <Loader class="!size-4"></Loader>
                        </Button>
                    </div>
                    <div v-else>
                        <Loader></Loader>
                    </div>
                </div>

                <!--  -->

                <div class="my-15"></div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[25%]"> Domain </TableHead>
                            <TableHead class="w-[15%]"> Password </TableHead>
                            <TableHead class="w-[25%]"> Link </TableHead>
                            <TableHead class="w-[30%]"> Description </TableHead>
                            <TableHead class="w-[5%]"> Actions </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="link of links" class="h-[2rem]">
                            <TableCell class="max-w-[20dvw] overflow-x-auto">
                                {{ "*".includes(link.domain) ? "All Domains" : link.domain }}
                            </TableCell>
                            <TableCell>
                                <CustomPasswordInput v-if="link.password" readonly :model-value="link.password">
                                </CustomPasswordInput>
                                <div v-else class="ml-1"> No password </div>
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-2 relative w-[95%]">
                                    <Input class="pr-8" readonly
                                        :model-value="`${hostname}/shared/${link.link}`"></Input>
                                    <Copy @click="copyLink(`${hostname}/shared/${link.link}`)"
                                        class="size-4 absolute right-2 cursor-pointer"></Copy>
                                </div>
                            </TableCell>
                            <TableCell class="max-w-[20dvw] overflow-x-auto">
                                {{ link.description ?? 'No description' }}
                            </TableCell>
                            <TableCell class="flex justify-end">
                                <Button @click="deleteLink(link._id.toString())" variant="destructive" size="icon">
                                    <Trash class="size-4" />
                                </Button>

                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <div v-else>
            <Loader></Loader>
        </div>

    </div>
</template>