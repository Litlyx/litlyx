// https://nuxt.com/docs/api/configuration/nuxt-config

import path from 'path';

export default defineNuxtConfig({
  css: [path.join(__dirname, './assets/lyxui.scss')],
  modules: ['@nuxt/ui'],
  components: [
    {
      path: './components',
      prefix: 'LyxUi'
    },
  ]
})
