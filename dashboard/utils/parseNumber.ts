

export function parseNumberInt(value: any, defaultValue: number) {
    const int = parseInt(value);
    if (!int) return defaultValue;
    if (isNaN(int)) return defaultValue;
    return int;
}