import type { StringExpressionOperator } from "mongoose";

type RefOrPrimitive<T> = T | Ref<T> | ComputedRef<T>

export type CustomOptions = {
    useSnapshotDates?: boolean,
    useActivePid?: boolean,
    slice?: RefOrPrimitive<string>,
    limit?: RefOrPrimitive<number | string>,
    custom?: Record<string, RefOrPrimitive<string>>
}

const { token } = useAccessToken();
const { projectId } = useProject();
const { safeSnapshotDates } = useSnapshot()

function getValueFromRefOrPrimitive<T>(data?: T | Ref<T> | ComputedRef<T>) {
    if (!data) return;
    if (isRef(data)) return data.value;
    return data;
}

export function useComputedHeaders(customOptions?: CustomOptions) {
    const useSnapshotDates = customOptions?.useSnapshotDates || true;
    const useActivePid = customOptions?.useActivePid || true;

    const headers = computed<Record<string, string>>(() => {

        const parsedCustom: Record<string, string> = {}
        const customKeys = Object.keys(customOptions?.custom || {});
        for (const key of customKeys) {
            parsedCustom[key] = getValueFromRefOrPrimitive((customOptions?.custom || {})[key]) ?? ''
        }

        return {
            'Authorization': `Bearer ${token.value}`,
            'x-pid': useActivePid ? (projectId.value ?? '') : '',
            'x-from': useSnapshotDates ? (safeSnapshotDates.value.from ?? '') : '',
            'x-to': useSnapshotDates ? (safeSnapshotDates.value.to ?? '') : '',
            'x-slice': getValueFromRefOrPrimitive(customOptions?.slice) ?? '',
            'x-limit': getValueFromRefOrPrimitive(customOptions?.limit)?.toString() ?? '',
            ...parsedCustom
        }
    })

    return headers;
}