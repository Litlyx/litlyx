<script setup lang="ts">

definePageMeta({ layout: 'none' });

const route = useRoute();
const jwtLogin = computed(() => route.query.jwt_login as string);
const { token, setToken } = useAccessToken();

onMounted(async () => {

    if (jwtLogin.value) {
        setToken(jwtLogin.value);
        const user = await $fetch<any>('/api/user/me', { headers: { 'Authorization': 'Bearer ' + token.value } })
        const loggedUser = useLoggedUser();
        loggedUser.user = user;
        setTimeout(() => { location.href = '/project_creation?just_logged=true' }, 100);
    }

})


</script>


<template>
    <div> You will be redirected soon </div>
</template>



<style scoped lang="scss"></style>