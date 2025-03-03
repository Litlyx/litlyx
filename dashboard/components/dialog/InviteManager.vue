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

function acceptInvite(project_id: string) {

}

function declineInvite(project_id: string) {

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
        <div class="h-full flex flex-col gap-8 p-4">

            <div class="flex flex-col gap-2" v-for="invite of [...invites, ...invites, ...invites]">

                <div class="dark:text-lyx-text text-lyx-lightmode-text">
                    You are invited to join
                    <span class="font-semibold">{{ invite.project_name }}</span>.
                    Do you accept this invitation?
                </div>

                <div class="flex gap-4">
                    <LyxUiButton @click="acceptInvite(invite.project_id)" type="primary"> Accept </LyxUiButton>
                    <LyxUiButton @click="declineInvite(invite.project_id)" type="danger"> Decline </LyxUiButton>
                </div>

            </div>



        </div>
    </UModal>
</template>