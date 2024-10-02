
const ACCESS_TOKEN_COOKIE_KEY = 'access_token';

const tokenCookie = useCookie(ACCESS_TOKEN_COOKIE_KEY, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });
const token = ref<string | undefined>();

export function signHeaders(headers?: Record<string, string>) {
    const { token } = useAccessToken()
    return { headers: { ...(headers || {}), 'Authorization': 'Bearer ' + token.value } }
}

export const authorizationHeaderComputed = computed(() => {
    const { token } = useAccessToken()
    return token.value ? 'Bearer ' + token.value : '';
});

function setToken(value: string) {
    tokenCookie.value = value;
    token.value = value;
}

export function useAccessToken() {
    if (!token.value) token.value = tokenCookie.value as any;
    return { setToken, token }
}