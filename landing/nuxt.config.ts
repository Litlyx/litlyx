// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  colorMode: { preference: 'dark', },
  devtools: { enabled: false },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js',
          'data-project': '6643cd08a1854e3b81722ab5',
          defer: true
        }
      ]
    }
  },
  pages: true,
  ssr: true,
  routeRules: {
    '/': {
      prerender: true
    },
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
