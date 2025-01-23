// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from 'node:url';

const gooleSignInConfig: any = {
  googleSignIn: {
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID || 'NONE'
  }
}

export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
  },

  colorMode: {
    preference: 'dark',
  },

  devtools: {
    enabled: false
  },

  pages: true,
  ssr: false,
  css: [
    '~/assets/main.css',
    '~/assets/scss/main.scss',
  ],
  alias: {
    '@schema': fileURLToPath(new URL('./shared/schema', import.meta.url)),
    '@services': fileURLToPath(new URL('./shared/services', import.meta.url)),
    '@data': fileURLToPath(new URL('./shared/data', import.meta.url)),
    '@functions': fileURLToPath(new URL('./shared/functions', import.meta.url)),
  },
  runtimeConfig: {
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    AI_ORG: process.env.AI_ORG,
    AI_PROJECT: process.env.AI_PROJECT,
    AI_KEY: process.env.AI_KEY,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
    GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    GITHUB_AUTH_CLIENT_ID: process.env.GITHUB_AUTH_CLIENT_ID,
    GITHUB_AUTH_CLIENT_SECRET: process.env.GITHUB_AUTH_CLIENT_SECRET,
    STRIPE_SECRET: process.env.STRIPE_SECRET,
    STRIPE_WH_SECRET: process.env.STRIPE_WH_SECRET,
    STRIPE_SECRET_TEST: process.env.STRIPE_SECRET_TEST,
    STRIPE_WH_SECRET_TEST: process.env.STRIPE_WH_SECRET_TEST,
    NOAUTH_USER_EMAIL: process.env.NOAUTH_USER_EMAIL,
    NOAUTH_USER_NAME: process.env.NOAUTH_USER_NAME,
    SELFHOSTED: process.env.SELFHOSTED || 'FALSE',
    public: {
      AUTH_MODE: process.env.AUTH_MODE,
      GITHUB_CLIENT_ID: process.env.GITHUB_AUTH_CLIENT_ID || 'NONE',
      SELFHOSTED: process.env.SELFHOSTED || 'FALSE',
    }

  },

  nitro: {
    plugins: ['~/server/init.ts']
  },

  plugins: [
    { src: '~/plugins/chartjs.ts', mode: 'client' }
  ],

  ...gooleSignInConfig,
  modules: ['@nuxt/ui', 'nuxt-vue3-google-signin'],

  devServer: {
    host: '0.0.0.0',
  },

  components: true,
  compatibilityDate: '2024-11-16'
})