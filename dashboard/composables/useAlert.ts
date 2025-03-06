

export type Alert = {
    title: string,
    text: string,
    icon: string,
    ms: number,
    id: number,
    remaining: number,
    transitionStyle: string
}

const alerts = ref<Alert[]>([]);

const idPool = {
    id: 0,
    getId() {
        return idPool.id++;
    }
}

function createAlert(title: string, text: string, icon: string, ms: number) {
    const alert = reactive<Alert>({
        title, text, icon, ms, id: idPool.getId(), remaining: ms,
        transitionStyle: 'transition: all 250ms linear;'
    });
    alerts.value.push(alert);
    const timeout = setInterval(() => {
        alert.remaining -= 250;
        if (alert.remaining <= 0) {
            closeAlert(alert.id);
            clearInterval(timeout);
        }
    }, 250)
}

function createSuccessAlert(title: string, text: string, ms?: number) {
    return createAlert(title, text, 'far fa-circle-check', ms ?? 5000);
}

function createErrorAlert(title: string, text: string, ms?: number) {
    return createAlert(title, text, 'far fa-triangle-exclamation', ms ?? 5000);
}


function closeAlert(id: number) {
    alerts.value = alerts.value.filter(e => e.id != id);
}

export function useAlert() {
    return { alerts, createAlert, closeAlert, createSuccessAlert, createErrorAlert }
}