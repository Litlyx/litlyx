



export function useTextType(options: { ms: number, increase: number }, onTickAction?: () => any) {

    let interval: any;
    const index = ref<number>(0);

    function onTick() {
        index.value += options.increase;
        onTickAction?.();
    }

    function pause() {
        if (interval) clearInterval(interval);
    }

    function resume() {
        if (interval) clearInterval(interval);
        interval = setInterval(() => onTick(), options.ms);
    }

    function stop() {
        if (interval) clearTimeout(interval);
    }

    function start() {
        index.value = 0;
        if (interval) clearInterval(interval);
        interval = setInterval(() => onTick(), options.ms);
    }

    return { start, stop, resume, pause, index, interval }

}