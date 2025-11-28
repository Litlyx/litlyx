import { toast, type ExternalToast } from "vue-sonner";
import { FetchError } from 'ofetch'


const showToastFunction = (message: string, data: ExternalToast) => toast.success(message, { position: 'top-right', ...data });

export type UseCatchOptions<T> = {
    toast?: boolean,
    toastTitle?: string,
    action: () => T,
    onError?: (ex: FetchError | Error) => any,
    onGenericError?: (ex: Error) => any,
    onFetchError?: (ex: FetchError) => any,
    onSuccess?: (data: Awaited<T>, showToast: typeof showToastFunction) => any
}

export const ERRORS_MAP: Record<string, string> = {
    'WORKSPACE_LIMIT_REACHED': 'Workspace limit reached. Please upgrade your plan.',
    'MEMBERS_LIMIT_REACHED': 'Members limit reached. Please upgrade your plan.'
}

export async function useCatch<T>(options: UseCatchOptions<T>): Promise<T | void> {

    try {
        const result = await options.action();
        await options?.onSuccess?.(result, showToastFunction);
        return result;
    } catch (ex) {

        console.dir(ex);

        if (ex instanceof FetchError) {
            if (options?.toast) {
                const targetError = ERRORS_MAP[ex.data.statusMessage as string];
                toast.error(options?.toastTitle ?? 'Error', { description: targetError ?? ex.data.message ?? 'An error occurred. Please contact support.', position: 'top-right' });
            }
            options?.onError?.(ex);
            options?.onFetchError?.(ex);
        } else if (ex instanceof Error) {
            if (options?.toast) {
                toast.error('Error', { description: 'An error occurred. Please contact support.', position: 'top-right' });
            }
            options?.onError?.(ex);
            options?.onGenericError?.(ex);
        } else {
            console.error('NOT HANDLED');
        }

    }

}