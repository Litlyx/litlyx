

const isOpen = ref<boolean>(false);

function open() { isOpen.value = true; }
function close() { isOpen.value = false; return true; }
function toggle() { isOpen.value = !isOpen.value; }
function set(value: boolean) { isOpen.value = value; }

export function useMenu() {
    return { isOpen, open, close, toggle, set }
}