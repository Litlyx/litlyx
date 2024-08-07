import type { Component } from "vue";


const showDialog = ref<boolean>(false);
const dialogParams = ref<any>({});
const dialogComponent = ref<Component>();
const dialogWidth = ref<string>("100%");
const dialogHeight = ref<string>("100%");
const dialogClosable = ref<boolean>(true);

function closeDialog() {
    showDialog.value = false;
}

export type CustomDialogOptions = {
    params?: any,
    width?: string,
    height?: string,
    closable?: boolean
}

function openDialogEx(component: Component, options?: CustomDialogOptions) {
    dialogComponent.value = component;
    dialogParams.value = options?.params || {};
    showDialog.value = true;
    dialogWidth.value = options?.width || '100%';
    dialogHeight.value = options?.height || '100%';
    dialogClosable.value = options?.closable ?? true;
}

function openDialog(component: Component, params: any) {
    dialogComponent.value = component;
    dialogParams.value = params;
    showDialog.value = true;
    dialogWidth.value = '100%';
    dialogHeight.value = '100%';
}

const dialogStyle = computed(() => {
    return `width: ${dialogWidth.value}; height: ${dialogHeight.value}`;
});

export function useCustomDialog() {
    return { showDialog, openDialogEx, closeDialog, openDialog, dialogParams, dialogComponent, dialogStyle, dialogClosable };
}