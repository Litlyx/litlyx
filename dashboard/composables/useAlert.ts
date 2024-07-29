

export type Alert = {
    title: string,
    text: string,
    icon: string,
    ms: number,
    id: number
}

const alerts = ref<Alert[]>([]);

const idPool = {
    id: 0,
    getId() {
        return idPool.id++;
    }
}

function createAlert(title: string, text: string, icon: string, ms: number) {
    const alert: Alert = { title, text, icon, ms, id: idPool.getId() }
    alerts.value.push(alert);
    setTimeout(() => {
        closeAlert(alert.id);
    }, ms)
}

function closeAlert(id: number) {
    alerts.value = alerts.value.filter(e => e.id != id);
}

export function useAlert() {
    return { alerts, createAlert, closeAlert }
}