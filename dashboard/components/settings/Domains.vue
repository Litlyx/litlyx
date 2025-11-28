<script setup lang="ts">
import { toast } from 'vue-sonner';
import { CopyIcon, LoaderCircle, Trash } from 'lucide-vue-next';
import type { TDomainRes } from '~/server/api/domains/list_count';
import { DialogDeleteDomainData } from '#components';


const { data: domainsCount } = useAuthFetch<(TDomainRes & { percent: number })[]>('/api/domains/list_count', {
    transform: (data) => {
        const max = Math.max(...data.map(e => e.visits));
        return data.toSorted((a, b) => b.visits - a.visits).map(e => {
            return { ...e, percent: 100 / max * e.visits }
        }).filter(e => e._id != '*');
    }
});

const selectedDomain = ref<string>('');
const deleteVisits = ref<boolean>(false);
const deleteEvents = ref<boolean>(false);

watch(selectedDomain, () => {
    deleteVisits.value = false;
    deleteEvents.value = false;
})

const dialog = useDialog();

async function showDeleteDataDialog() {
    dialog.open({
        body: DialogDeleteDomainData,
        title: 'Delete domain data',
        props: { domain: selectedDomain.value },
        onSuccess(_, close) {
            close();
            deleteData(selectedDomain.value);
        },
    })
}

async function deleteData(domain: string) {
    await useCatch({
        toast: true,
        toastTitle: 'Error deleting domain data',
        async action() {
            await useAuthFetchSync('/api/domains/delete_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { domain, visits: deleteVisits.value, events: deleteEvents.value }
            })
        },
        onSuccess(_, showToast) {
            showToast('Deleting scheduled', { description: 'Data deletetion is scheduled. You will see the results shortly.', position: 'top-right' })
            selectedDomain.value = '';
        },
    })
}

</script>

<template>
    <Card>
        <CardContent class="flex flex-col gap-2">

            <div class="p-4 flex flex-col gap-3">
                <Label> Delete data of a specific domain </Label>
                <div class="flex gap-4">
                    <div class="flex flex-col gap-2" v-if="domainsCount">
                        <Select v-model="selectedDomain" v-if="domainsCount.length > 0">
                            <SelectTrigger>
                                <SelectValue class="min-w-[15rem] max-w-[25rem]" placeholder="Select a domain">
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent class="max-h-[20rem]">
                                <SelectGroup>
                                    <SelectItem v-for="domain of domainsCount" :value="domain.name">
                                        {{ domain.name }} [{{ domain.visits }}] ({{ domain.percent.toFixed(1) }}%)
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div v-if="domainsCount.length == 0">
                            No domains to manage
                        </div>

                        <div v-if="selectedDomain" class="flex items-center gap-2">
                            <Checkbox v-model="deleteVisits"></Checkbox>
                            <div>Visits</div>
                        </div>
                        <div v-if="selectedDomain" class="flex items-center gap-2">
                            <Checkbox v-model="deleteEvents"></Checkbox>
                            <div>Events</div>
                        </div>

                        <Button @click="showDeleteDataDialog()" v-if="selectedDomain"
                            :disabled="!deleteVisits && !deleteEvents" variant="destructive">
                            Delete
                        </Button>

                    </div>
                    <div class="poppins" v-else>

                        <div class="flex items-center gap-2">
                            <LoaderCircle class="size-5 animate-[spin_1s_ease-in-out_infinite] duration-500">
                            </LoaderCircle>
                            <div>Loading domains data</div>
                        </div>

                    </div>

                </div>
            </div>

            <!-- <div class="p-4 flex flex-col gap-3">
            <Label> Project id </Label>
            <div class="flex gap-4">
                <Input class="poppins" :default-value="projectStore.activeProject?._id.toString()" readonly></Input>
                <Button @click="copyProjectId()" class="w-[6rem]">
                    <CopyIcon></CopyIcon>
                    Copy
                </Button>
            </div>
        </div>

        <div class="p-4 flex flex-col gap-3">
            <Label> Script </Label>
            <div class="flex gap-4 items-center">
                <Textarea class="w-full poppins resize-none" :default-value="scriptValue.join('')" readonly></Textarea>
                <Button @click="copyScript()" class="w-[6rem]">
                    <CopyIcon></CopyIcon>
                    Copy
                </Button>
            </div>
        </div>


        <div class="flex justify-center mt-8">
            <Button variant="destructive">
                <Trash></Trash>
                Delete project
            </Button>
        </div> -->

        </CardContent>
    </Card>
</template>