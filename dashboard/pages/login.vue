<script setup lang="ts">

definePageMeta({ layout: 'none' });

import { Lit } from 'litlyx-js';

const config = useRuntimeConfig()
const isNoAuth = ref<boolean>(config.public.AUTH_MODE == 'NO_AUTH');

const useCodeClientWrapper = isNoAuth.value === false ?
    useCodeClient :
    (...args: any) => {
        return { isReady: false, login: () => { } }
    }

async function loginWithoutAuth() {
    try {
        const result = await $fetch('/api/auth/no_auth');
        if (result.error) return alert('Error during login, please try again');

        setToken(result.access_token);

        const user = await $fetch<any>('/api/user/me', { headers: { 'Authorization': 'Bearer ' + token.value } })
        const loggedUser = useLoggedUser();
        loggedUser.user = user;

        console.log('LOGIN DONE - USER', loggedUser.user);

        const isFirstTime = await $fetch<boolean>('/api/user/is_first_time', { headers: { 'Authorization': 'Bearer ' + token.value } })

        if (isFirstTime === true) {
            router.push('/project_creation?just_logged=true');
        } else {
            router.push('/?just_logged=true');
        }

    } catch (ex: any) {
        alert('Error during login.' + ex.message);
    }
}

const { isReady, login } = useCodeClientWrapper({ onSuccess: handleOnSuccess, onError: handleOnError, });

const router = useRouter();

const { token, setToken } = useAccessToken();

async function handleOnSuccess(response: any) {

    try {
        const result = await $fetch('/api/auth/google_login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: response.code })
        })

        Lit.event('google_login_signup');

        if (result.error) return alert('Error during login, please try again');

        setToken(result.access_token);

        const user = await $fetch<any>('/api/user/me', { headers: { 'Authorization': 'Bearer ' + token.value } })
        const loggedUser = useLoggedUser();
        loggedUser.user = user;

        console.log('LOGIN DONE - USER', loggedUser.user);

        const isFirstTime = await $fetch<boolean>('/api/user/is_first_time', { headers: { 'Authorization': 'Bearer ' + token.value } })

        if (isFirstTime === true) {
            router.push('/project_creation?just_logged=true');
        } else {
            router.push('/?just_logged=true');
        }


    } catch (ex) {
        alert('Google sta avendo problemi con il login, ci scusiamo per il problema ma non dipende da noi.');
    }

};

function handleOnError(errorResponse: any) {
    alert('Error' + errorResponse);
};

function getRandomHex(size: number) {
    const bytes = new Uint8Array(size);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
}

function githubLogin() {
    const client_id = config.public.GITHUB_CLIENT_ID;
    const redirect_uri = window.location.origin + '/api';
    console.log({ redirect_uri })
    const state = getRandomHex(16);
    localStorage.setItem("latestCSRFToken", state);
    const link = `https://github.com/login/oauth/authorize?client_id=${client_id}&response_type=code&scope=repo&redirect_uri=${redirect_uri}/integrations/github/oauth2/callback&state=${state}`;
    window.location.assign(link);
}

const route = useRoute();

onMounted(() => {
    if (route.query.github_access_token) {
        //TODO: Something
    }
})

const isEmailLogin = ref<boolean>(false);
const email = ref<string>("");
const password = ref<string>("");

function goBackToEmailLogin() {
    isEmailLogin.value = false;
    email.value = '';
    password.value = '';
}

async function signInWithCredentials() {

    try {
        const result = await $fetch<{ error: true, message: string } | { error: false, access_token: string }>('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        })

        if (result.error) return alert(result.message);

        setToken(result.access_token);

        const user = await $fetch<any>('/api/user/me', { headers: { 'Authorization': 'Bearer ' + token.value } })
        const loggedUser = useLoggedUser();
        loggedUser.user = user;

        console.log('LOGIN DONE - USER', loggedUser.user);

        const isFirstTime = await $fetch<boolean>('/api/user/is_first_time', { headers: { 'Authorization': 'Bearer ' + token.value } })

        if (isFirstTime === true) {
            router.push('/project_creation?just_logged=true');
        } else {
            router.push('/?just_logged=true');
        }


    } catch (ex) {
        alert('Something went wrong.');
    }
}


</script>


<template>

    <div class="home w-full h-full">

        <div class="flex h-full bg-lyx-lightmode-background dark:bg-lyx-background">

            <div class="flex-1 flex flex-col items-center pt-20 xl:pt-[22vh]">

                <!-- <div class="rotating-thing absolute top-0"></div> -->

                <div class="mb-8 bg-black rounded-xl">
                    <img class="w-[5rem]" :src="'logo.png'">
                </div>

                <div class="text-lyx-lightmode-text dark:text-lyx-text text-[2.2rem] font-bold poppins">
                    Sign in
                </div>

                <div class="text-lyx-lightmode-text/80 dark:text-lyx-text/80 text-[1.2rem] font-light text-center w-[70%] poppins mt-2">
                    Track web analytics and custom events
                    with extreme simplicity in under 30 sec.
                    <br>
                    <!-- <div class="font-bold poppins mt-4">
                        Start for Free now! Up to 3k visits/events monthly.
                    </div> -->
                </div>

                <div class="mt-12">

                    <div v-if="!isNoAuth && isEmailLogin" class="flex flex-col gap-2">


                        <div class="flex flex-col gap-4 z-[100] w-[20vw] min-w-[20rem]">
                            <LyxUiInput class="px-3 py-2" placeholder="Email" v-model="email"></LyxUiInput>
                            <LyxUiInput class="px-3 py-2" placeholder="Password" v-model="password" type="password">
                            </LyxUiInput>
                        </div>

                        <div class="flex justify-end">
                            <RouterLink tag="div" to="/forgot_password"
                                class="text-center text-lyx-lightmode-text dark:text-lyx-text-dark underline cursor-pointer z-[110]">
                                Forgot password?
                            </RouterLink>
                        </div>

                        <div class="flex justify-center mt-4 z-[100]">
                            <LyxUiButton @click="signInWithCredentials()" class="text-center" type="primary">
                                Sign in
                            </LyxUiButton>
                        </div>

                        <div @click="goBackToEmailLogin()"
                            class="mt-4 text-center text-lyx-lightmode-text dark:text-lyx-text-dark underline cursor-pointer z-[100]">
                            Go back
                        </div>


                    </div>

                    <div v-if="!isNoAuth && !isEmailLogin" class="flex flex-col text-lyx-lightmode-text dark:text-lyx-text gap-2">

                        <div @click="login"
                            class="hover:bg-lyx-primary bg-white dark:bg-transparent cursor-pointer flex text-[1.3rem] gap-4 items-center border-[1px] border-gray-400 rounded-lg px-8 py-3 relative z-[2]">
                            <div class="flex items-center">
                                <i class="fab fa-google"></i>
                            </div>
                            Continue with Google
                        </div>

                        <div @click="isEmailLogin = true"
                            class="hover:bg-[#d3d3d3] dark:hover:bg-[#262626] bg-white dark:bg-transparent cursor-pointer flex text-[1.3rem] gap-4 items-center border-[1px] border-gray-400 rounded-lg px-8 py-3 relative z-[2]">
                            <div class="flex items-center">
                                <i class="far fa-envelope"></i>
                            </div>
                            Sign in with Email
                        </div>


                        <div class="flex flex-col gap-2 mt-4">

                            <RouterLink tag="div" to="/register"
                                class="text-center text-lyx-lightmode-text-dark dark:text-lyx-text-dark underline cursor-pointer z-[100]">
                                You don't have an account ? Sign up
                            </RouterLink>

                        </div>

                    </div>

                    <div v-if="isNoAuth" @click="loginWithoutAuth"
                        class="hover:bg-accent cursor-pointer flex text-[1.3rem] gap-4 items-center border-[1px] border-gray-400 rounded-lg px-8 py-3 relative z-[2]">
                        <div class="flex items-center">
                            <i class="far fa-crown"></i>
                        </div>
                        Continue as Admin
                    </div>

                </div>

                <div class="text-[.9rem] poppins mt-20 text-lyx-lightmode-text-dark dark:text-lyx-text-dark text-center relative z-[2]">
                    By continuing you are accepting
                    <br>
                    our
                    <a class="underline" href="https://litlyx.com/terms" target="_blank">Terms of Service</a> and
                    <a class="underline" href="https://litlyx.com/privacy" target="_blank">Privacy Policy</a>.
                </div>


            </div>

            <div class="grow flex-1 items-center justify-center hidden lg:flex">

                <!-- <GlobeSvg></GlobeSvg> -->

                <img :src="'image-bg.png'" class="h-full py-6">

            </div>
        </div>


        <!-- <div class="flex flex-col items-center justify-center mt-40 gap-20">
            <div class="google-login text-gray-700" :class="{ disabled: !isReady }" @click="login">
                <div class="icon">
                    <i class="fab fa-google"></i>
                </div>
                <div> Continua con Google </div>
            </div>
        </div> -->

    </div>

</template>



<style scoped lang="scss">
.rotating-thing {
    height: 100%;
    aspect-ratio: 1 / 1;
    opacity: 0.15;
    background: radial-gradient(51.24% 31.29% at 50% 50%, rgb(51, 58, 232) 0%, rgba(51, 58, 232, 0) 100%);
    animation: 12s linear 0s infinite normal none running spin;
}

.google-login {
    cursor: pointer;
    font-weight: bold;
    background-color: #fcefed;
    padding: 1rem 2rem;
    border-radius: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;

    &.disabled {
        filter: brightness(50%);
    }

    i {
        font-size: 1.5rem;
    }
}
</style>