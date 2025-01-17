

const app = useRuntimeConfig();

export function useSelfhosted() {
    return app.public.SELFHOSTED === 'TRUE' || app.public.SELFHOSTED !== 'true';
}