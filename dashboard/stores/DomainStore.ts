
import type { TDomainSimpleRes } from "~/server/api/domains/list";

export const useDomainStore = defineStore('domain', () => {

    const domains = shallowRef<TDomainSimpleRes[]>([]);
    const activeDomain = shallowRef<TDomainSimpleRes>();
    const domainPending = ref<boolean>(false);

    async function fetchDomains() {
        domains.value = [];
        activeDomain.value = undefined;
        domainPending.value = true;
        await nextTick();
        const res = await useAuthFetchSync<TDomainSimpleRes[]>('/api/domains/list');
        domains.value = res;
        if (domains.value.length > 0) activeDomain.value = domains.value[0];
        domainPending.value = false;
    }

    function setActive(domain_id: string) {
        activeDomain.value = domains.value.find(e => domain_id === e._id.toString());
    }

    return {
        domains,
        activeDomain,
        fetchDomains,
        setActive,
        domainPending
    }

})