import tailwindcss from '@tailwindcss/vite'

import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  alias: {
    '@schema': fileURLToPath(new URL('./shared/schema', import.meta.url)),
    '@services': fileURLToPath(new URL('./shared/services', import.meta.url)),
    '@data': fileURLToPath(new URL('./shared/data', import.meta.url)),
    '@functions': fileURLToPath(new URL('./shared/functions', import.meta.url)),
  },
  runtimeConfig: {
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,

    BASE_URL: process.env.BASE_URL,

    EMAIL_TRPC_URL: process.env.EMAIL_TRPC_URL,
    EMAIL_SECRET: process.env.EMAIL_SECRET,

    PAYMENT_TRPC_URL: process.env.PAYMENT_TRPC_URL,
    PAYMENT_SECRET: process.env.PAYMENT_SECRET,

    AI_ORG: process.env.AI_ORG,
    AI_PROJECT: process.env.AI_PROJECT,
    AI_KEY: process.env.AI_KEY,

    REDIS_URL: process.env.REDIS_URL,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    RESET_PASSWORD_SECRET: process.env.RESET_PASSWORD_SECRET,

    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    LICENSE_KEY: process.env.LICENSE_KEY,

    public: {
      SELFHOSTED: process.env.SELFHOSTED,
      AI_ENABLED: process.env.AI_ENABLED
    },

    MODE: process.env.MODE,
    oauth: {
      google: {
        clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        redirectURL: process.env.GOOGLE_AUTH_REDIRECT_URI
      }
    }
  },
  auth: { hash: { scrypt: {} } },
  components: {
    dirs: [
      { path: '~/components/global', global: true },
      { path: '~/components', ignore: ['complex/**'] }
    ],
  },
  modules: [
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/mdc',
    '@vueuse/nuxt'
  ],
  shadcn: {
    componentDir: './components/ui',
    prefix: ''
  },
  colorMode: {
    classSuffix: ''
  },
  devServer: {
    host: '0.0.0.0'
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/scss/main.scss',
    '~/assets/css/tailwind.css',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
})