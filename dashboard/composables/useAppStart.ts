
import { toast } from 'vue-sonner';

async function loadData() {
    const { loggedIn } = useUserSession();
    if (!loggedIn.value) return;
    const router = useRouter();
    const projectStore = useProjectStore();
    const snapshotStore = useSnapshotStore();
    const domainStore = useDomainStore();
    const premiumStore = usePremiumStore();
    try {
        await projectStore.fetchProjects();
        if (projectStore.projects.length == 0) {
            router.push('/create_project?first=true');
            return false;
        }
        await projectStore.fetchActivePermissions();
        await projectStore.fetchPendingInvites();
        await snapshotStore.fetchSnapshots();
        await domainStore.fetchDomains();
        await premiumStore.fetchPremium();
        return true;
    } catch (ex: any) {
        console.error(ex);
        toast('Error', { description: ex.message, position: 'top-right' });
    }
}

export function useAppStart() {

    return { loadData }

}