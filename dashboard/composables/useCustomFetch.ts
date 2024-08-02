import type { InternalApi } from 'nitropack';
import type { WatchSource, WatchStopHandle } from 'vue';


type NitroFetchRequest = Exclude<keyof InternalApi, `/_${string}` | `/api/_${string}`> | (string & {});

export type CustomFetchOptions = {
    watchProps?: WatchSource[],
    lazy?: boolean,
    method?: string,
    getBody?: () => Record<string, any>,
    watchKey?: string
}

type OnResponseCallback<TData> = (data: Ref<TData | undefined>) => any
type OnRequestCallback = () => any


const watchStopHandles: Record<string, WatchStopHandle> = {}

export function useCustomFetch<T>(url: NitroFetchRequest, getHeaders: () => Record<string, string>, options?: CustomFetchOptions) {

    const pending = ref<boolean>(false);
    const data = ref<T | undefined>();
    const error = ref<Error | undefined>();

    let onResponseCallback: OnResponseCallback<T> = () => { }
    let onRequestCallback: OnRequestCallback = () => { }

    const onResponse = (callback: OnResponseCallback<T>) => {
        onResponseCallback = callback;
    }

    const onRequest = (callback: OnRequestCallback) => {
        onRequestCallback = callback;
    }

    const execute = async () => {
        onRequestCallback();
        pending.value = true;
        error.value = undefined;
        try {

            data.value = await $fetch<T>(url, {
                headers: getHeaders(),
                method: (options?.method || 'GET') as any,
                body: options?.getBody ? JSON.stringify(options.getBody()) : undefined
            });

            onResponseCallback(data);
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

        const watchStop = watch(options.watchProps, () => {
            execute();
        });

        const key = options?.watchKey || `${url}`;
        if (watchStopHandles[key]) watchStopHandles[key]();
        watchStopHandles[key] = watchStop;

        console.log('Watchers:', Object.keys(watchStopHandles).length);


    }

    const refresh = execute;

    return { pending, execute, data, error, refresh, onResponse, onRequest };
}
