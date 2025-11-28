

export function getBoolean(value: string | number | boolean | null | undefined) {

    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
    } else if (typeof value === 'boolean') {
        return value;
    } else {
        return false;
    }

}