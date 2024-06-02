// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  colorMode: { preference: 'dark', },
  devtools: { enabled: false },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/litlyx@1.0.5/browser/litlyx.js',
          'data-project': '6643cd08a1854e3b81722ab5',
          defer: true
        }
      ]
    }
  },
  pages: true,
  ssr: false,
  routeRules: {
    '/**': {
      prerender: true
    },
  },
  css: ['~/assets/scss/main.scss'],
  modules: ['@nuxt/ui'],
  devServer: {
    host: '0.0.0.0',
  },
})
