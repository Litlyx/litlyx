import type { InternalApi } from 'nitropack';
import type { WatchSource } from 'vue';


type NitroFetchRequest = Exclude<keyof InternalApi, `/_${string}` | `/api/_${string}`> | (string & {});

export type CustomFetchOptions = {
    watchProps?: WatchSource[],
    lazy?: boolean
}

export function useCustomFetch<T>(url: NitroFetchRequest, getHeaders: () => Record<string, string>, options?: CustomFetchOptions) {

    const pending = ref<boolean>(false);
    const data = ref<T | undefined>();
    const error = ref<Error | undefined>();

    const execute = async () => {
        pending.value = true;
        error.value = undefined;
        try {
            data.value = await $fetch<T>(url, { headers: getHeaders() });
        } catch (err) {
            error.value = err as Error;
        } finally {
            pending.value = false;
        }
    }

    if (options?.lazy !== true) {
        execute();
    }

    if (options?.watchProps) {
        watch(options.watchProps, () => {
            execute();
        });
    }

    return { pending, execute, data, error };
}