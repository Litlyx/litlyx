
export function requireEnv(name: string, errorMessage?: string) {
    if (!process.env[name]) {
        console.error(errorMessage || `ENV variable ${name} is required`);
        return process.exit(1);
    }
    console.log('requireEnv', name, process.env[name]);
    return process.env[name] as string;
}