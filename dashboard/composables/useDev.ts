

const data = ref<any>({});

function setData(name: string, value: any) {
    data.value[name] = value;
}

function getData(name: string, prefix: string = '', suffix: string = '') {
    return `${prefix} ${data.value[name]} ${suffix}`;
}

export function useDev() {
    const route = useRoute();
    const isDev = computed(() => route.query['dev'] === "1");
    return { isDev, setData, getData }
}