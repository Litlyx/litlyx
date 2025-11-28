<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const email = ref<string>('');
const password = ref<string>('');

const emits = defineEmits<{ (event: 'submit', data: { email: string, password: string }): void }>();
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit.prevent="emits('submit', { email, password })" class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">
                Ayaya Images
              </h1>
              <p class="text-gray-500 text-balance dark:text-gray-400">
                Start create images now
              </p>
              <p class="text-gray-500 text-balance dark:text-gray-400 mt-2">
                Creating an account will allow you to use all the features of the ayaya-generator
              </p>
            </div>
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="email@example.com" required />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
              </div>
              <Input id="password" v-model="password" type="password" minlength="4" required />
            </div>
            <Button type="submit" class="w-full">
              Register
            </Button>
            <div class="text-center text-sm">
              Already have an account?
              <NuxtLink to="/login" class="underline underline-offset-4">
                Sign In
              </NuxtLink>
            </div>
          </div>
        </form>
        <div class="bg-gray-100 relative hidden md:block dark:bg-gray-800">
          <img src="/bg.avif" alt="Image"
            class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
        </div>
      </CardContent>
    </Card>
  </div>
</template>
