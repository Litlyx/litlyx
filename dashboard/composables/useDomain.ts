

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

const refreshingDomains = computed(() => domainsRequest.pending.value);

const domainList = computed(() => {
    return [
        {
            _id: 'ALL DOMAINS', visits: domainsRequest.data.value?.reduce((a, e) => a + e.visits, 0)
        },
        ...(domainsRequest.data.value?.sort((a, b) => b.visits - a.visits) || [])
    ]
})


const activeDomain = ref<string>();

const domain = computed(() => {
    if (activeDomain.value) return activeDomain.value;
    if (!domainList.value) return;
    if (domainList.value.length == 0) return;
    setActiveDomain(domainList.value[0]._id);
    return domainList.value[0]._id;
})

function setActiveDomain(domain: string) {
    activeDomain.value = domain;
}

export function useDomain() {
    return { domainList, domain, setActiveDomain, refreshDomains, refreshingDomains }
}