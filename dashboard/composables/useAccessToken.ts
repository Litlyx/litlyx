


const ACCESS_TOKEN_STATE_KEY = 'access_token';
const ACCESS_TOKEN_COOKIE_KEY = 'access_token';

export function signHeaders(headers?: Record<string, string>) {
    const { token } = useAccessToken()
    return { headers: { ...(headers || {}), 'Authorization': 'Bearer ' + token.value } }
}

export const authorizationHeaderComputed = computed(() => {
    const { token } = useAccessToken()
    return token.value ? 'Bearer ' + token.value : '';
});

export function useAccessToken() {

    const tokenCookie = useCookie(ACCESS_TOKEN_COOKIE_KEY, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) })

    const token = useState<string | undefined | null>(ACCESS_TOKEN_STATE_KEY);
    const needLoad = useState<boolean>('needAccessTokenLoad', () => true);


    const readToken = () => {
        token.value = tokenCookie.value;
        needLoad.value = false;
    }
    const setToken = (newToken: string) => {
        tokenCookie.value = newToken;
        token.value = tokenCookie.value;
        needLoad.value = false;
    }

    if (needLoad.value == true) readToken();


    return { token, readToken, setToken, needLoad }
}