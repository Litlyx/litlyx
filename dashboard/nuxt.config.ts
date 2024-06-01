// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from 'node:url';

const gooleSignInConfig: any = {
  googleSignIn: {
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID
  }
}

export default defineNuxtConfig({
  colorMode: {
    preference: 'dark',
  },
  devtools: {
    enabled: false
  },
  pages: true,
  ssr: false,
  css: ['~/assets/scss/main.scss'],
  alias: {
    '@schema': fileURLToPath(new URL('../shared/schema', import.meta.url)),
    '@services': fileURLToPath(new URL('../shared/services', import.meta.url)),
    '@data': fileURLToPath(new URL('../shared/data', import.meta.url)),
    '@functions': fileURLToPath(new URL('../shared/functions', import.meta.url)),
  },
  runtimeConfig: {
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    AI_ORG: process.env.AI_ORG,
    AI_PROJECT: process.env.AI_PROJECT,
    AI_KEY: process.env.AI_KEY,
    AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
    GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    public: {
      PAYPAL_CLIENT_ID: ''
    }

  },
  nitro: {
    plugins: ['~/server/init.ts']
  },
  ...gooleSignInConfig,
  modules: ['@nuxt/ui', 'nuxt-vue3-google-signin'],
  devServer: {
    host: '0.0.0.0',
  },
})
