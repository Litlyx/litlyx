

const app = useRuntimeConfig();

export function useSelfhosted() {
    return app.public.SELFHOSTED.toString() === 'TRUE' || app.public.SELFHOSTED.toString() === 'true';
}