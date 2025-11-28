import type { FetchError } from 'ofetch';
import type { FetchResult, UseFetchOptions, AsyncData } from "#app";
import type { NitroFetchRequest, AvailableRouterMethod } from 'nitropack';

type PickFrom<T, K extends Array<string>> = T extends Array<any> ? T : T extends Record<string, any> ? keyof T extends K[number] ? T : K[number] extends never ? T : Pick<T, K[number]> : T;
type KeysOf<T> = Array<T extends T ? keyof T extends string ? keyof T : never : never>;


//@ts-ignore
export function useAuthFetch<
    ResT = void,
    ErrorT = FetchError,
    ReqT extends NitroFetchRequest = NitroFetchRequest,
    Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'get' extends AvailableRouterMethod<ReqT> ? 'get' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>,
    _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
    DataT = _ResT,
    PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
    DefaultT = null
>(
    request: Ref<ReqT> | ReqT | (() => ReqT),
    opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null> {

    const projectStore = useProjectStore();
    const snapshotStore = useSnapshotStore();
    const domainStore = useDomainStore();


    const { sharedLink, sharedFrom, sharedTo, sharedSlice, sharedPassword } = useShared();

    const isDev = useDev();

    opts = opts ?? {}
    opts.lazy = opts.lazy ?? true;
    opts.headers = opts.headers ?? {}

    opts.headers = {
        ...opts.headers,
        'x-pid': computed(() => projectStore.pid ?? ''),
        'x-domain': computed(() => domainStore.activeDomain?._id ?? ''),
        'x-from': computed(() => snapshotStore.from?.toString() ?? ''),
        'x-to': computed(() => snapshotStore.to?.toString() ?? ''),
        'x-dev': computed(() => isDev ? 'true' : 'false'),
        'x-shared-link': computed(() => sharedLink.value ?? ''),
        'x-shared-from': computed(() => sharedFrom.value ?? ''),
        'x-shared-to': computed(() => sharedTo.value ?? ''),
        'x-shared-slice': computed(() => sharedSlice.value ?? ''),
        'x-shared-pass': computed(() => sharedPassword.value ?? ''),
    }


    return useFetch(request, opts);
}

export async function useAuthFetchSync<T>(url: string, options?: any) {

    const projectStore = useProjectStore();
    const snapshotStore = useSnapshotStore();
    const domainStore = useDomainStore();

    const { sharedLink, sharedFrom, sharedTo, sharedSlice, sharedPassword } = useShared();

    const isDev = useDev();

    options = options ?? {}
    options.headers = options.headers ?? {}

    options.headers = {
        ...options.headers,
        'x-pid': projectStore.pid ?? '',
        'x-domain': domainStore.activeDomain?._id ?? '',
        'x-from': snapshotStore.from?.toString() ?? '',
        'x-to': snapshotStore.to?.toString() ?? '',
        'x-dev': isDev ? 'true' : 'false',
        'x-shared-link': sharedLink.value ?? '',
        'x-shared-from': sharedFrom.value ?? '',
        'x-shared-to': sharedTo.value ?? '',
        'x-shared-slice': sharedSlice.value ?? '',
        'x-shared-pass': sharedPassword.value ?? ''
    }

    return await $fetch<T>(url, options);

}