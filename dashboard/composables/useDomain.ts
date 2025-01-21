

const { token } = useAccessToken();
const { projectId } = useProject();

const domainsRequest = useFetch<{ _id: string }[]>('/api/domains/list', {
    headers: computed(() => {
        return {
            'Authorization': `Bearer ${token.value}`,
            'x-pid': projectId.value || ''
        }
    })
});

const domainList = computed(() => {
    return domainsRequest.data.value?.map(e => e._id);
})

const activeDomain = ref<string>();

const domain = computed(() => {
    if (activeDomain.value) return activeDomain.value;
    if (!domainList.value) return;
    if (domainList.value.length == 0) return;
    activeDomain.value = domainList.value[0];
    return domainList.value[0];
})

function setActiveDomain(domain: string) {
    activeDomain.value = domain;
}

export function useDomain() {

    return { domainList, domain, setActiveDomain }
}