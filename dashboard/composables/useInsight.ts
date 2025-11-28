


const insight = ref<string>("");
const insightStatus = ref<'success' | 'pending'>('pending');

async function insightRefresh() {
    if (isSelfhosted()) return;
    insightStatus.value = 'pending';
    insight.value = await useAuthFetchSync('/api/ai/insight');
    insightStatus.value = 'success';
}

export function useInsight() {
    if (insightStatus.value !== 'success') insightRefresh();
    return { insight, insightRefresh, insightStatus }
}