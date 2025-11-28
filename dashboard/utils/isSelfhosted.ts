
function truthy(value: any, ifNull: boolean) {
    if (value === undefined || value === null || value === '') return ifNull;
    return value === 'true' || value === true || value === '1' || value === 1;
}

export function isSelfhosted() {
    const config = useRuntimeConfig();
    return truthy(config.public.SELFHOSTED, false);
}

export function isAiEnabled() {
    const config = useRuntimeConfig();
    return truthy(config.public.AI_ENABLED, true);
}