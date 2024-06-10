import type { Component } from "vue";


const showDialog = ref<boolean>(false);
const dialogParams = ref<any>({});
const dialogComponent = ref<Component>();

function closeDialog() {
    showDialog.value = false;
}

function openDialog(component: Component, params: any) {
    dialogComponent.value = component;
    dialogParams.value = params;
    showDialog.value = true;
}

export function useCustomDialog() {
    return { showDialog, closeDialog, openDialog, dialogParams, dialogComponent };
}