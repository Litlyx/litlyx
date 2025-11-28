type InferEmitPayload<E, K extends string> =
    E extends Record<K, (...args: infer A) => any> ? A[0] : never

export type EmitOf<T, K extends string> =
    T extends { __emitOptions?: infer E }
    ? InferEmitPayload<E, K>
    : T extends new (...args: any) => { $emit: (event: K, ...args: infer A) => any }
    ? A[0]
    : never

type ExtractProp<T, K extends string> =
    T extends { new(...args: any): { $props: infer P } }
    ? K extends keyof P
    ? P[K]
    : never
    : never;

export type GlobalDialogPropsData<T extends Component> = {
    body: T,
    footer?: Component,
    title?: string,
    description?: string,
    props?: ExtractProp<T, 'data'>
    onSuccess?: (data: EmitOf<T, 'confirm'>, close: () => any) => any,
}

const currentDialogData = shallowRef<GlobalDialogPropsData<any>>();
const dialogOpen = ref<boolean>(false);

export function useDialog() {

    const open = <T extends Component>(data: GlobalDialogPropsData<T>) => {
        currentDialogData.value = data;
        dialogOpen.value = true;
    }

    const close = () => {
        dialogOpen.value = false;
    }

    return { open, close, isOpen: dialogOpen, data: currentDialogData }
}