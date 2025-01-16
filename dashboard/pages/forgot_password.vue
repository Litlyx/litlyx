<script setup lang="ts">

definePageMeta({ layout: 'none' });

const email = ref<string>("");

const emailSended = ref<boolean>(false);

const { createAlert } = useAlert();

async function resetPassword() {

    try {
        const res = await $fetch('/api/user/password/reset', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ email: email.value })
        })

        if (!res) throw Error('No response');

        if (res.error) return createAlert('Error', res.message, 'far fa-triangle-exclamation', 5000);
        emailSended.value = true;
        return createAlert('Success', 'Email sent', 'far fa-circle-check', 5000);

    } catch (ex) {
        console.error(ex);
        createAlert('Error', 'Internal error', 'far fa-triangle-exclamation', 5000);
    }



}

</script>


<template>

    <div class="home w-full h-full">

        <div class="flex h-full">

            <div class="flex-1 flex flex-col items-center pt-20 xl:pt-[22vh]">

                <div class="rotating-thing absolute top-0"></div>

                <div class="mb-8 bg-black rounded-xl">
                    <img class="w-[5rem]" :src="'logo.png'">
                </div>

                <div class="text-lyx-lightmode-text dark:text-lyx-text text-[2.2rem] font-bold poppins">
                    Reset password
                </div>

                <div class="text-lyx-lightmode-text dark:text-lyx-text/80 text-[1.2rem] font-light text-center w-[70%] poppins mt-2">
                    Enter your user account's verified email address and we will send you a temporary password.
                </div>

                <div class="mt-12">

                    <div v-if="!emailSended" class="flex flex-col gap-2 z-[110]">


                        <div class="flex flex-col gap-4 z-[100] w-[20vw] min-w-[20rem]">
                            <LyxUiInput class="px-3 py-2" placeholder="Email" v-model="email"></LyxUiInput>
                        </div>

                        <div class="flex justify-center mt-4">
                            <LyxUiButton @click="resetPassword()" class="text-center z-[110]" type="primary">
                                Reset password
                            </LyxUiButton>
                        </div>

                        <NuxtLink to="/login"
                            class="mt-4 text-center text-lyx-lightmode-text dark:text-lyx-text-dark underline cursor-pointer z-[110]">
                            Go back
                        </NuxtLink>


                    </div>


                    <div v-if="emailSended" class="mt-12 flex flex-col text-center text-[1.1rem] z-[100]">
                        <div>
                            Check your email inbox.
                        </div>
                        <RouterLink tag="div" to="/login"
                            class="mt-6 text-center text-lyx-lightmode-text dark:text-lyx-text-dark underline cursor-pointer z-[110]">
                            Go back
                        </RouterLink>
                    </div>

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