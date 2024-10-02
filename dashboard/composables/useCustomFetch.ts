
export type CustomOptions = {
    useSnapshotDates?: boolean,
    useActivePid?: boolean,
    slice?: string,
}

const { token } = useAccessToken();
const { projectId } = useProject();
const { safeSnapshotDates } = useSnapshot()

export function useComputedHeaders(customOptions?: CustomOptions) {
    const useSnapshotDates = customOptions?.useSnapshotDates || true;
    const useActivePid = customOptions?.useActivePid || true;

    const headers = computed<Record<string, string>>(() => {
        return {
            'Authorization': `Bearer ${token.value}`,
            'x-pid': useActivePid ? (projectId.value ?? '') : '',
            'x-from': useSnapshotDates ? (safeSnapshotDates.value.from ?? '') : '',
            'x-to': useSnapshotDates ? (safeSnapshotDates.value.to ?? '') : '',
            'x-slice': customOptions?.slice ?? ''
        }
    })

    return headers;
}