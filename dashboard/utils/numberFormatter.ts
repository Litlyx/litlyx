export function prettyNumber000(value: number | string) {
    return Math.floor(parseInt(value.toString())).toLocaleString('en-EN').replace(/,/g, '.');
}

export function formatNumberK(value: string | number, decimals: number = 1) {
    const num = parseInt(value.toString());

    if (num > 1_000_000) return (num / 1_000_000).toFixed(decimals) + ' M';
    if (num > 1_000) return (num / 1_000).toFixed(decimals) + ' K';

    return isNaN(num) ? '0' : num.toFixed();

}

export function formatTime(ms: number, includeNotUsedHours: boolean = true): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    if (includeNotUsedHours === false && hours == 0) {
        return `${pad(minutes)}m ${pad(seconds)}s`;
    } else {
        return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
}

export function formatBytes(bytes: number, decimals: number = 2) {
    if (bytes > 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(decimals) + ' GB';
    if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(decimals) + ' MB';
    if (bytes > 1024) return (bytes / 1024).toFixed(decimals) + ' KB';
    return bytes.toFixed(decimals) + ' B'
}