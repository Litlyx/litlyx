import type { AuthContext } from "~/server/middleware/01-authorization";


const loggedUser = ref<AuthContext | undefined>();

const setLoggedUser = (authContext?: AuthContext) => {
    loggedUser.value = authContext;
};

const isLogged = computed(() => {
    return loggedUser.value?.logged;
})

function getUserRoles() {
    const isPremium = computed(() => {
        if (!loggedUser.value?.logged) return false;
        return loggedUser.value.user.roles.includes('PREMIUM');
    });
    const isAdmin = computed(() => {
        if (!loggedUser.value?.logged) return false;
        return loggedUser.value.user.roles.includes('ADMIN');
    });

    return { isPremium, isAdmin }
}

export const isAdminHidden = ref<boolean>(false);

export function useLoggedUser() {
    return {
        isLogged,
        user: loggedUser,
        userRoles: getUserRoles(),
        setLoggedUser
    }
}



