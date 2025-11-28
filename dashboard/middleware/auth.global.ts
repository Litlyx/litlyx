

const allowedAnonRoutes = [
    '/login',
    '/register',
    '/live_demo',
    '/jwt_login',
    '/forgot_password',
    '/reset_password'
]

// const FREE_TRIAL_ENDED = 7999;

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { loggedIn } = useUserSession();

    if (to.path.includes('/shared/')) {
        return;
    }

    //TODO: SELFHOST
    
    if (loggedIn.value === true) {
        // const plan = await useAuthFetchSync('/api/user/plan');

        // if (to.path != '/free_trial_ended' && plan.premium_type === FREE_TRIAL_ENDED ) {
        //     return '/free_trial_ended'
        // }

        // if (to.path == '/free_trial_ended' && plan.premium_type !== FREE_TRIAL_ENDED) {
        //     return '/'
        // }

        if (to.path == '/login' || to.path == '/register' || to.path == '/forgot_password') return '/';



    } else {

        if (!allowedAnonRoutes.includes(to.path)) {
            return '/login';
        }

    }

});
