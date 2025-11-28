<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GalleryVerticalEnd } from 'lucide-vue-next'

const props = defineProps<{
  class?: HTMLAttributes['class'],
  loading: boolean
}>()

const email = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');

const emits = defineEmits<{
  (event: 'submit', data: { email: string, password: string }): void,
  (event: 'oauth', provider: 'google'): void,
}>();

const canRegister = computed(() => {
  const isEmailValid = email.value.includes('@');
  const isPasswordValid = password.value.length >= 6;
  const isPasswordConfirmed = password.value === confirmPassword.value;

  return isEmailValid && isPasswordValid && isPasswordConfirmed;
});

const passwordStrength = computed(() => {
  const val = password.value
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[\W_]/.test(val)) score++

  if (score <= 1) return { percent: 25, label: 'Weak', class: 'bg-red-400/80' }
  if (score === 2) return { percent: 50, label: 'Moderate', class: 'bg-yellow-400/80' }
  if (score === 3) return { percent: 75, label: 'Strong', class: 'bg-blue-400/80' }
  return { percent: 100, label: 'Very Strong', class: 'bg-green-400/80' }
})


</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)" class="dark">
    <form @submit.prevent="emits('submit', { email, password })">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col items-center gap-4">
          <div class="flex items-center gap-2 font-medium">
            <img src="/logo-white.svg" class="h-16">
          </div>

          <div class="text-center text-sm text-gray-200">
            Already have an account?
            <NuxtLink to="/login"
              class="underline underline-offset-2 hover:underline-offset-4 transition-all text-white font-medium">
              Sign in
            </NuxtLink>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="space-y-2">
            <Label for="email" class="text-gray-200">Email</Label>
            <Input v-model="email" id="email" type="email" placeholder="insert@email.com" required
              class="!bg-white/10  !border-white/40 !text-white/80 !border-0 !h-12" />
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <Label for="password" class="text-gray-200">Password</Label>

              <div v-if="password.length >= 1">
                <TooltipProvider>

                  <Tooltip>
                    <TooltipTrigger>
                      <div class="w-12 h-2 rounded bg-white/10">
                        <div :class="['h-2 rounded transition-all', passwordStrength.class]"
                          :style="{ width: passwordStrength.percent + '%' }"></div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{{ passwordStrength.label }} password</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

              </div>
            </div>
            <InputPassword id="password" v-model="password" required
              class="!bg-white/10  !border-white/40 !text-white/80 !border-0 !h-12" />
          </div>
          <div class="space-y-2">
            <Label for="password" class="text-gray-200">Confirm password</Label>
            <InputPassword id="password" v-model="confirmPassword" required
              class="!bg-white/10  !border-white/40 !text-white/80 !border-0 !h-12"
              :class="confirmPassword === password  ? '!ring-green-400/80' : '!ring-red-400/80'" />

          </div>
          <Button :disabled="!canRegister || loading" type="submit" class="w-full cursor-pointer h-12">
            <Loader v-if="loading" class="!size-6"></Loader>
            <span v-if="!loading"> Register </span>
          </Button>


          <fieldset class="border-t border-gray-200 text-center">
            <legend class="px-2 text-sm text-white">Or</legend>
          </fieldset>
          <div class="flex flex-col gap-4">
            <Button @click="emits('oauth', 'google')" variant="outline" type="button"
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
