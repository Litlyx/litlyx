<script lang="ts" setup>
import { useSelectMenuStyle } from '~/composables/ui/useSelectMenuStyle';
import type { TTeamMember } from '~/shared/schema/TeamMemberSchema';

const emit = defineEmits(['success', 'cancel'])

const props = defineProps<{ member_id: string }>();

const { domainList, domain, setActiveDomain, refreshDomains, refreshingDomains } = useDomain();

const { data: member } = useFetch<TTeamMember>(`/api/project/members/get?member_id=${props.member_id}`, {
    headers: useComputedHeaders({})
})

const { createAlert } = useAlert()

async function save(member_id: string) {
    if (!member.value) return;
    const res = await $fetch('/api/project/members/edit', {
        method: 'POST',
        headers: useComputedHeaders({ custom: { 'Content-Type': 'application/json' } }).value,
        body: JSON.stringify({
            member_id,
            webAnalytics: member.value.permission.webAnalytics,
            events: member.value.permission.events,
            ai: member.value.permission.ai,
            domains: member.value.permission.domains
        })
    });
    createAlert('Saved', 'Permission saved successfully', 'fas fa-check', 2500);
    emit('success')
}

</script>



<template>
    <UModal :ui="{
        strategy: 'override',
        overlay: {
            background: 'bg-lyx-background/85'
        },
        background: 'bg-lyx-lightmode-widget dark:bg-lyx-widget',
        ring: 'border-solid border-[1px] border-[#262626]'
    }">
        <div class="p-8">
            <div v-if="member" class="manage flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <div>
                        <div class="mb-1"> Allowed domains </div>
                        <div class="mb-1">
                            <USelectMenu v-model="member.permission.domains" :options="domainList" multiple
                                value-attribute="_id">
                                <template #option="{ option, active, selected }">
                                    <div class="flex items-center gap-2">
                                        <div>
                                            <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'"
                                                alt="Litlyx logo">
                                        </div>
                                        <div> {{ option._id }} </div>
                                    </div>
                                </template>
                                <template #label="e">
                                    <div class="flex items-center gap-2">
                                        <div>
                                            <img class="h-5 bg-black rounded-full" :src="'/logo_32.png'"
                                                alt="Litlyx logo">
                                        </div>
                                        <div>
                                            {{
                                                member.permission.domains.length > 2 ?
                                                    `${member.permission.domains.length} domains` :
                                                    (member.permission.domains.map(e => e).join(' & ') || 'No domains')
                                            }}
                                        </div>
                                    </div>
                                </template>
                            </USelectMenu>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <UCheckbox v-model="member.permission.webAnalytics"></UCheckbox>
                        <div> Allow web analytics page </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <UCheckbox v-model="member.permission.events"></UCheckbox>
                        <div> Allow events page </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <UCheckbox v-model="member.permission.ai"></UCheckbox>
                        <div> Allow AI page </div>
                    </div>
                </div>
            </div>




            <div class="flex gap-2 justify-end mt-8">
                <LyxUiButton v-if="member?.permission" @click="save(member._id.toString())" type="primary">
                    Save
                </LyxUiButton>
                <LyxUiButton type="secondary" @click="emit('cancel')"> Cancel </LyxUiButton>
            </div>

        </div>
    </UModal>

</template>