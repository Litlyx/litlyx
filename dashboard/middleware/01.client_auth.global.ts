import type { AuthContext } from "~/server/middleware/01-authorization";

async function executeUserLogin(token: string): Promise<[true, AuthContext] | [false, null]> {
    const user = await $fetch<AuthContext>('/api/user/me', { headers: { 'Authorization': 'Bearer ' + token } });
    console.log('USER RESPSONSE', user);
    if (!user) return [false, null];
    if (user.logged == false) return [false, null];
    return [true, user];
}

async function handleUserLogin(authContext?: AuthContext) {

    if (authContext) return;

    const { token, setToken } = useAccessToken();

    if (!token.value || token.value.length == 0) {
        setToken(''); // LOGOUT
        return;
    }

    const [ok, newContext] = await executeUserLogin(token.value);

    if (!ok) {
        setToken(''); // LOGOUT
        return;
    }

    setLoggedUser(newContext);

}

export default defineNuxtRouteMiddleware(async (to, from) => {

    if (!to.name) return;

    const loggedUser = useLoggedUser();
    await handleUserLogin(loggedUser.value);

    if (loggedUser.value?.logged) {
        if (to.path == '/login') return '/';
    } else {
        if (to.path != '/login' && to.path != '/live_demo') return '/login';
    }

})