


export function useTextWriter() {
    const text = ref<string>("");

    const queue: string[] = [];
    let currentQueueIndex = 0;

    let totalText: string;
    let interval: any;

    function start(ms: number, msBeforeText: number) {
        const currentQueueText = queue[currentQueueIndex];
        totalText = currentQueueText;
        stop();
        text.value = '';
        interval = setInterval(() => {
            const nextLen = text.value.length + 1;
            text.value = totalText.substring(0, nextLen);
            if (text.value.length >= totalText.length) {
                currentQueueIndex++;
                if (currentQueueIndex > queue.length - 1) {
                    currentQueueIndex = 0;
                }
                stop();
                setTimeout(() => {
                    start(ms, msBeforeText);
                }, msBeforeText)
            }
        }, ms);
    }

    function addToQueue(newText: string) {
        queue.push(newText);
    }

    function stop() {
        if (interval) clearInterval(interval);
    }

    onUnmounted(() => {
        stop();
    })

    return {
        currentText: text, addToQueue, start, stop
    }
}