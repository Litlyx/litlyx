<script setup lang="ts">

definePageMeta({ layout: 'none' });

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
        loggedUser.value = user;

        console.log('LOGIN DONE - USER', loggedUser.value);

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

        if (result.error) return alert('Error during login, please try again');

        setToken(result.access_token);

        const user = await $fetch<any>('/api/user/me', { headers: { 'Authorization': 'Bearer ' + token.value } })
        const loggedUser = useLoggedUser();
        loggedUser.value = user;

        console.log('LOGIN DONE - USER', loggedUser.value);

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

</script>


<template>

    <div class="home w-full h-full">

        <div class="flex h-full">

            <div class="flex-1 flex flex-col items-center pt-20 lg:pt-[22vh]">

                <div class="rotating-thing absolute top-0"></div>

                <div class="mb-8 bg-black rounded-xl">
                    <img class="w-[5rem]" :src="'logo.png'">
                </div>

                <div class="text-text text-[2.2rem] font-bold poppins">
                    Sign in with
                </div>

                <div class="text-text/80 text-[1.2rem] text-center w-[70%] poppins mt-2">
                    Real-time analytics for 15+ JS/TS frameworks
                    <br>
                    with one-line code setup.
                    <br>
                    <div class="font-bold poppins mt-4">
                        Start for Free now! Up to 3k visits/events monthly.
                    </div>
                </div>

                <div class="mt-12">

                    <div v-if="!isNoAuth" @click="login"
                        class="hover:bg-accent cursor-pointer flex text-[1.3rem] gap-4 items-center border-[1px] border-gray-400 rounded-lg px-8 py-3 relative z-[2]">
                        <div class="flex items-center">
                            <i class="fab fa-google"></i>
                        </div>
                        Continue with Google
                    </div>

                    <div v-if="isNoAuth" @click="loginWithoutAuth"
                        class="hover:bg-accent cursor-pointer flex text-[1.3rem] gap-4 items-center border-[1px] border-gray-400 rounded-lg px-8 py-3 relative z-[2]">
                        <div class="flex items-center">
                            <i class="far fa-crown"></i>
                        </div>
                        Continue as Admin
                    </div>

                </div>

                <div class="text-[.9rem] poppins mt-12 text-text-sub text-center relative z-[2]">
                    By continuing you are indicating that you accept
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