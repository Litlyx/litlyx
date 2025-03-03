

const { token } = useAccessToken();
const { projectId } = useProject();

const domainsRequest = useFetch<{ _id: string, visits: number }[]>('/api/domains/list', {
    headers: computed(() => {
        return {
            'Authorization': `Bearer ${token.value}`,
            'x-pid': projectId.value || ''
        }
    })
});

function refreshDomains() {
    domainsRequest.refresh();
}

watch(domainsRequest.data, () => {
    if (!domainsRequest.data.value) return;
    setActiveDomain(domainList.value[0]._id);
});

const refreshingDomains = computed(() => domainsRequest.pending.value);

const domainList = computed(() => {
    return (domainsRequest.data.value?.sort((a, b) => b.visits - a.visits) || []);
})


const activeDomain = ref<string>();

const domain = computed(() => {
    return activeDomain.value;
})

function setActiveDomain(domain: string) {
    activeDomain.value = domain;
}

export function useDomain() {
    return { domainList, domain, setActiveDomain, refreshDomains, refreshingDomains }
}