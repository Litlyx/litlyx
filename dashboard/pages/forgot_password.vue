<script setup lang="ts">
const email = ref<string>();
const email_confirm = ref<string>();
const colorMode = useColorMode()

const canReset = computed(() => {
    if (!email.value) return false;
    if (!email.value.includes('@')) return false;
    if (!email.value.includes('.')) return false;
    if (email.value.length == 0) return false;
    if (email.value != email_confirm.value) return false;
    return true;
})

async function sendForgotPasswordEmail() {
    await useCatch({
        toast: true,
        toastTitle: 'Error during request',
        async action() {
            await useAuthFetchSync('/api/user/forgot_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { email: email.value }
            });
            email.value = '';
            email_confirm.value = '';
        },
        onSuccess(_, showToast) {
            showToast('Success', { description: 'An email was sent to reset the password.' })
        },
    });
}

</script>

<template>
    <div class="flex justify-center h-dvh items-center ">
  <div class='flex flex-col gap-6 max-w-[80dvw] md:max-w-[60dvw]'>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-center gap-2 font-medium">
            <img :src="colorMode.value==='dark' ? '/logo-white.svg' : '/logo-black.svg'" class="h-16">
          </div>
          <div class="text-center text-sm">
            Have an account?
            <NuxtLink to="/login" class="underline underline-offset-4">
              Sign in
            </NuxtLink>
          </div>
        </div>
            <div>
                <Label class="text-lg"> Reset Your Password </Label>
                <div class="text-muted-foreground">
                    Please enter your email address below to which we can send you instructions.
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <Label>Email</Label>
                <Input v-model="email"></Input>
                <div class="my-2"></div>
                <Label>Confirm Email</Label>
                <Input v-model="email_confirm"></Input>
                <Button @click="sendForgotPasswordEmail()" :disabled="!canReset" class="mt-4"> Send Instructions
                </Button>
            </div>

      </div>
    <div
      class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      By clicking continue, you agree to our <a href="https://litlyx.com/terms-of-service" target="_blank"> Terms of
        Service</a>
      and <a href="https://litlyx.com/privacy-policy" target="_blank">Privacy Policy</a>.
    </div>
  </div></div>
</template>

