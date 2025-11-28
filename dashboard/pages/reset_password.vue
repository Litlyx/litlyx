<script setup lang="ts">

const router = useRouter();

const password = ref<string>();
const password_confirm = ref<string>();

const canReset = computed(() => {
    if (!password.value) return false;
    if (password.value.length < 6) return false;
    if (password.value.length > 64) return false;
    if (password.value != password_confirm.value) return false;
    return true;
})


const route = useRoute();

const data = computed(() => {
    if (!route.query.code) return;
    if (!route.query.mail) return;

    return {
        email: atob(route.query.mail as string),
        code: route.query.code as string
    };
})

async function setNewPassword() {
    await useCatch({
        toast: true,
        toastTitle: 'Error during request',
        async action() {
            await useAuthFetchSync('/api/user/set_new_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { email: data.value?.email, jwt: data.value?.code, password: password.value }
            });
            password.value = '';
            password_confirm.value = '';
        },
        onSuccess(_, showToast) {
            showToast('Success', { description: 'New password has been set.' })
            router.push('/login');
        },
    });
}


</script>

<template>
    <div class="flex justify-center h-dvh items-center">
  <div v-if="data" class='flex flex-col gap-6'>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-center gap-2 font-medium">
            <img :src="'logo-white.svg'" class="h-16">
          </div>
        </div>
            <div>
                <Label class="text-lg">Create new password</Label>
                <span class="text-muted-foreground">
                    Please create a new password for your account <strong>{{ data.email }}</strong>
                </span>
            </div>

            <div class="flex flex-col gap-2">
                <Label>Password</Label>
                <InputPassword v-model="password" />
                <div class="my-2"></div>
                <Label>Confirm Password</Label>
                <InputPassword v-model="password_confirm" />
                <Button @click="setNewPassword()" :disabled="!canReset" class="mt-4">
                    Set new password
                </Button>
            </div>

      </div>
    <div
      class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      By clicking continue, you agree to our <a href="https://litlyx.com/terms-of-service" target="_blank"> Terms of
        Service</a>
      and <a href="https://litlyx.com/privacy-policy" target="_blank">Privacy Policy</a>.
    </div>
  </div>
          <div v-else class="flex flex-col items-center gap-4">
                        <img :src="'logo-white.svg'" class="h-16">

            <span>Something went wrong, contact us on <strong>help@litlyx.com</strong>.</span>
          </div>
  </div>
</template>
