export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('ai_context', {
        mounted(el: HTMLElement, binding) { }
    })
});
