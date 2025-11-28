<script lang="ts" setup>
import { TrashIcon } from 'lucide-vue-next';


const { data: feedbacks, refresh } = useAuthFetch('/api/admin/feedbacks');

async function deleteFeedback(feedback_id: string) {
    const sure = confirm('Are you sure to delete the feedback ?');
    if (!sure) return;
    await useAuthFetch(`/api/admin/feedbacks_delete?id=${feedback_id}`);
    refresh();
}

</script>

<template>
    <div class="flex flex-col gap-4 h-full overflow-y-auto">

        <Card v-for="feedback of feedbacks?.toReversed()">
            <CardHeader>
                <div class="flex gap-4 justify-center text-muted-foreground">
                    <div> {{ feedback.user_id?.email ?? 'USER_DELETED' }} </div>
                    <div> Project: {{ feedback.project_id }} </div>
                </div>
                <CardAction>
                    <TrashIcon @click="deleteFeedback((feedback as any)._id.toString())" class="size-5"></TrashIcon>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div class="whitespace-pre-wrap">
                    {{ feedback.text }}
                </div>
            </CardContent>
        </Card>

    </div>
</template>