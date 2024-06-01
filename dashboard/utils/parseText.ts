export function parseText(text: string) {
    const entityRegex = /&#(\d+);/g;
    return text.replace(entityRegex, (match, dec) => {
        return String.fromCharCode(dec);
    }).replace(/&amp;/g, '&');
}