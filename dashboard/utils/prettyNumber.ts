

export function prettyNumber000(value: number | string) {
    return Math.floor(parseInt(value.toString())).toLocaleString('en-EN').replace(/,/g, '.');
}

export function formatNumberK(value: string | number, decimals: number = 1) {
    const num = parseInt(value.toString());

    if (num > 1_000_000) return (num / 1_000_000).toFixed(decimals) + ' M';
    if (num > 1_000) return (num / 1_000).toFixed(decimals) + ' K';
    return num.toFixed();

}