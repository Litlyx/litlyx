<script setup lang="ts">

const router = useRouter();

const loading = ref<boolean>(false);

async function register(event: { email: string, password: string }) {

    loading.value = true;

    await useCatch({
        toast: true,
        toastTitle: 'Error during login',
        async action() {
            await useAuthFetchSync('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: event,
            })
        },
        onSuccess(_, showToast) {
            showToast('Registration completed', {
                description: 'Registration completed, check your inbox to confirm your account',
                position: 'top-right'
            });
            router.push('/');
        },
    })

    loading.value = false;

}

async function oauth(provider: 'google') {
    location.href = `/api/auth/${provider}/authenticate`;
}

const bgRef = ref<HTMLElement | null>(null)

onMounted(() => {
    const bg = bgRef.value
    if (!bg || window.innerWidth < 768) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const lerp = (start: number, end: number, amt: number) => start + (end - start) * amt

    const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2 // range: -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        mouseX = x * 20 // max 20px offset
        mouseY = y * 20
    }

    const animate = () => {
        currentX = lerp(currentX, mouseX, 0.1)
        currentY = lerp(currentY, mouseY, 0.1)

        if (bg) {
            bg.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.1)`
        }

        requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animate()

    onUnmounted(() => {
        document.removeEventListener('mousemove', handleMouseMove)
    })
})

function getRandomPercent(min: number, max: number): string {
    return `${Math.random() * (max - min) + min}%`;
}

function getRandomSeconds(min: number, max: number): string {
    return `${Math.random() * (max - min) + min}s`;
}

const totalStars = 6;

const stars = ref(
    Array.from({ length: totalStars }).map(() => ({
        top: getRandomPercent(20, 70),     // da 20% a 70% in verticale
        left: getRandomPercent(65, 90),    // solo nella zona destra
        delay: getRandomSeconds(0, 8),
        duration: getRandomSeconds(8, 12)
    }))
);
</script>

<template>
    <div class="relative flex overflow-hidden min-h-svh flex-col items-center justify-center">
        <!-- Sfondo dinamico ingrandito -->
        <div ref="bgRef" class="absolute inset-0 -z-10 w-full h-full overflow-hidden">
            <img src="/planet.png" alt="bg"
                class="w-full h-full object-cover object-bottom scale-120 pointer-events-none" />

            <!-- Stelle generate dinamicamente -->
            <div v-for="(star, index) in stars" :key="index" class="twinkle-star" :style="{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
                animationDuration: star.duration
            }"></div>
        </div>

        <!-- Contenuto sopra -->
        <div class="flex flex-col items-center justify-center gap-6 p-6 md:p-10 relative z-10">
            <div
                class="w-full max-w-sm px-4 py-4 bg-violet-400/20 backdrop-blur-xl rounded-xl border border-violet-400/40 shadow-xl shadow-violet-400/10">
                <AuthRegisterForm :loading="loading" @submit="register($event)" @oauth="oauth($event)" />
            </div>

            <div
                class="!text-violet-100/80 *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our
                <a href="https://litlyx.com/terms-of-service" target="_blank">Terms of Service</a>
                and
                <a href="https://litlyx.com/privacy-policy" target="_blank">Privacy Policy</a>.
            </div>
        </div>
    </div>
</template>

<style scoped>
.twinkle-star {
    position: absolute;
    width: 3px;
    height: 3px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 6px 1px white;
    opacity: 0;
    animation-name: twinkle;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
}

@keyframes twinkle {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }

    5% {
        opacity: 1;
        transform: scale(1.4);
    }

    10% {
        opacity: 0;
        transform: scale(0.8);
    }

    100% {
        opacity: 0;
        transform: scale(0.8);
    }
}
</style>