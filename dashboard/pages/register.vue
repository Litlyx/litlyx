<script setup lang="ts">

definePageMeta({ layout: 'none' });

import { Lit } from 'litlyx-js';

const emailSended = ref<boolean>(false);

const email = ref<string>("");
const password = ref<string>("");
const passwordConfirm = ref<string>("");

const canRegister = computed(() => {
    if (email.value.length == 0) return false;
    if (!email.value.includes('@')) return false;
    if (!email.value.includes('.')) return false;
    if (password.value !== passwordConfirm.value) return false;
    if (password.value.length < 6) return false;
    return true;
});

async function registerAccount() {

    try {
        const res = await $fetch<any>('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value, password: password.value })
        });
        if (res.error === true) return alert(res.message);

        Lit.event('email_signup');

        emailSended.value = true;
    } catch (ex) {
        alert('Something went wrong');
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
                    Sign up
                </div>

                <div
                    class="text-lyx-lightmode-text dark:text-lyx-text/80 text-[1.2rem] font-light text-center w-[70%] poppins mt-2">
                    Track web analytics and custom events
                    with extreme simplicity in under 30 sec.
                    <br>
                    <!-- <div class="font-bold poppins mt-4">
                        Start for Free now! Up to 3k visits/events monthly.
                    </div> -->
                </div>

                <div v-if="!emailSended" class="mt-12">

                    <div class="flex flex-col gap-2">

                        <div class="flex flex-col gap-4 z-[100] w-[20vw] min-w-[20rem]">
                            <LyxUiInput class="px-3 py-2" placeholder="Email" v-model="email">
                            </LyxUiInput>
                            <LyxUiInput class="px-3 py-2" placeholder="Password" v-model="password" type="password">
                            </LyxUiInput>
                            <LyxUiInput class="px-3 py-2" placeholder="Confirm password" v-model="passwordConfirm"
                                type="password">
                            </LyxUiInput>
                        </div>

                        <div class="text-lyx-text-darker text-end text-[.8rem]">
                            Password must be at least 6 chars long
                        </div>
                        <div class="flex justify-center mt-4 z-[100]">
                            <LyxUiButton :disabled="!canRegister" @click="canRegister ? registerAccount() : ''"
                                class="text-center" type="primary">
                                Sign up
                            </LyxUiButton>
                        </div>

                        <RouterLink to="/login"
                            class="mt-4 text-center text-lyx-lightmode-text dark:text-lyx-text-dark underline cursor-pointer z-[100]">
                            Go back to login
                        </RouterLink>


                    </div>

                </div>

                <div v-if="emailSended" class="mt-12 flex flex-col text-center text-[1.1rem] z-[100]">
                    <div>
                        We sent you a confirm email.
                    </div>
                    <div>
                        Please check your inbox to confirm your account and complete your registration.
                    </div>
                    <RouterLink tag="div" to="/login"
                        class="mt-6 text-center text-lyx-lightmode-text dark:text-lyx-text-dark underline cursor-pointer">
                        Go back
                    </RouterLink>
                </div>

                <div v-if="!emailSended"
                    class="text-[.9rem] poppins mt-5 xl:mt-20 text-lyx-lightmode-text dark:text-lyx-text-dark text-center relative z-[2]">
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