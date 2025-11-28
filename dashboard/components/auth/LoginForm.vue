<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  class?: HTMLAttributes['class'],
  loading: boolean
}>()

const email = ref<string>('');
const password = ref<string>('');

const emits = defineEmits<{
  (event: 'submit', data: { email: string, password: string }): void,
  (event: 'oauth', provider: 'google'): void,
}>();

const checkInputs = computed(() => {
  const isEmailValid = email.value.trim() !== '' && email.value.includes('@');
  const isPasswordFilled = password.value.trim() !== '';

  return isEmailValid && isPasswordFilled;
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)" class="dark">
    <form @submit.prevent="emits('submit', { email, password })">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-center gap-2 font-medium">
            <img src="/logo-white.svg" class="h-16">
          </div>

          <div v-if="!isSelfhosted()" class="text-center text-sm text-gray-200">
            Don't have an account?
            <NuxtLink to="/register"
              class="underline underline-offset-2 hover:underline-offset-4 transition-all text-white font-medium">
              Sign Up </NuxtLink>
          </div>
        </div>


        <div class="flex flex-col gap-6">
          <div class="space-y-2">
            <Label for="email" class="text-gray-200">Email</Label>
            <Input v-model="email" id="email" type="email" placeholder="insert@email.com"
              class="!bg-white/10  !border-white/40 !text-white/80 !border-0 !h-12" required />
          </div>
          <div class="space-y-2">
            <div class="flex items-center">
              <Label for="password" class="text-gray-200">Password</Label>
              <NuxtLink v-if="!isSelfhosted()" to="/forgot_password" class="ml-auto text-sm underline-offset-4 hover:underline text-white">
                Forgot password?
              </NuxtLink>
            </div>
            <InputPassword id="password" v-model="password" required
              class="!bg-white/10  !border-white/40 !text-white/80 !border-0 !h-12" />
          </div>
          <Button type="submit" class="w-full  cursor-pointer h-12" :disabled="loading || !checkInputs">
            <Loader v-if="loading" class="!size-4"></Loader>
            <span v-if="!loading"> Login </span>
          </Button>

          <fieldset v-if="!isSelfhosted()" class="border-t border-gray-200 text-center">
            <legend class="px-2 text-sm text-white">Or</legend>
          </fieldset>
          <div v-if="!isSelfhosted()" class="flex flex-col gap-4">
            <Button @click="emits('oauth', 'google')" type="button" variant="outline"
              class="w-full text-white !border-0 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor" />
              </svg>
              Continue with Google
            </Button>

          </div>
        </div>

      </div>
    </form>

  </div>
</template>
