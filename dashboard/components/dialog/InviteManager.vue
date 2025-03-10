<script lang="ts" setup>
import Accept_invite from '~/pages/accept_invite.vue';


const { createAlert } = useAlert();
const { close } = useModal()

const emit = defineEmits(['success', 'cancel'])

const props = defineProps<{
    invites: {
        project_name: string, project_id: string
    }[]
}>();

async function acceptInvite(project_id: string) {
    try {
        await $fetch('/api/project/members/accept', {
            method: 'POST',
            body: JSON.stringify({ project_id }),
            headers: useComputedHeaders({
                custom: {
                    'Content-Type': 'application/json'
                }
            }).value
        });
        emit('success');
    } catch (ex) {
        console.error(ex);
        alert('Error accepting invite');
        emit('cancel');       
    }
}

async function declineInvite(project_id: string) {
    try {
        await $fetch('/api/project/members/decline', {
            method: 'POST',
            body: JSON.stringify({ project_id }),
            headers: useComputedHeaders({
                custom: {
                    'Content-Type': 'application/json'
                }
            }).value
        });
        emit('success');
    } catch (ex) {
        console.error(ex);
        alert('Error accepting invite');
        emit('cancel');
    }
}

</script>

<template>
    <UModal :ui="{
        strategy: 'override',
        overlay: {
            background: 'bg-lyx-background/85'
        },
        background: 'dark:bg-lyx-widget bg-lyx-lightmode-widget-light',
        ring: 'border-solid border-[1px] border-[#262626]'
    }">
        <div class="h-full flex flex-col gap-8 p-6">

            <div class="flex flex-col gap-6" v-for="invite of invites">

                <div class="dark:text-lyx-text text-lyx-lightmode-text">
                    You are invited to join
                    <span class="font-semibold">{{ invite.project_name }}</span>.
                    Do you accept?
                </div>

                <div class="flex gap-4 w-full justify-end">
                    <LyxUiButton @click="declineInvite(invite.project_id)" type="secondary"> Decline </LyxUiButton>
                    <LyxUiButton @click="acceptInvite(invite.project_id)" type="primary"> Accept </LyxUiButton>
                </div>

            </div>



        </div>
    </UModal>
</template>