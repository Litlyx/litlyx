import type { AuthContext } from "~/server/middleware/01-authorization";


const loggedUser = ref<AuthContext | undefined>();

const setLoggedUser = (authContext?: AuthContext) => {
    loggedUser.value = authContext;
};

const isLogged = computed(() => {
    return loggedUser.value?.logged;
})

const isAdmin = computed(() => {
    if (!loggedUser.value?.logged) return false;
    return loggedUser.value.user.roles.includes('ADMIN');
});

const isPremium = computed(() => {
    if (!loggedUser.value?.logged) return false;
    return loggedUser.value.user.roles.includes('PREMIUM');
});

function getUserRoles() {
    return { isAdmin, isPremium }
}

export const isAdminHidden = ref<boolean>(false);

export function useLoggedUser() {
    return {
        isLogged,
        isPremium,
        isAdmin,
        user: loggedUser,
        userRoles: getUserRoles(),
        setLoggedUser
    }
}



