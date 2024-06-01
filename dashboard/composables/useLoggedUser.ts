import type { AuthContext } from "~/server/middleware/01-authorization";

const LOGGED_USER_STATE_KEY = 'logged_user';


export function useLoggedUser() {
    const loggedUserState = useState<AuthContext | undefined>(LOGGED_USER_STATE_KEY);
    return loggedUserState;
}

export function setLoggedUser(authContext?: AuthContext) {
    useLoggedUser().value = authContext;
}

export const isAdminHidden = ref<boolean>(false);

export function useUserRoles() {

    const isPremium = computed(() => {
        const loggedUser = useLoggedUser();
        if (!loggedUser.value?.logged) return false;
        return loggedUser.value.user.roles.includes('PREMIUM');
    });
    const isAdmin = computed(() => {
        const loggedUser = useLoggedUser();
        if (!loggedUser.value?.logged) return false;
        return loggedUser.value.user.roles.includes('ADMIN');
    });
    return { isPremium, isAdmin }
}
