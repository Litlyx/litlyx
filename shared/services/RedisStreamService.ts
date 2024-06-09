import { createClient } from 'redis';
import { requireEnv } from '../utilts/requireEnv';

export type ReadingLoopOptions = {
    delay?: {
        base?: number,
        empty?: number
    },
    readBlock?: number,
    streamName: string
}

export class RedisStreamService {

    private static client = createClient({
        url: requireEnv("REDIS_URL"),
        username: requireEnv("REDIS_USERNAME"),
        password: requireEnv("REDIS_PASSWORD"),
    });

    static async connect() {
        await this.client.connect();
    }

    private static async readingLoop(options: ReadingLoopOptions, processFunction: (content: Record<string, string>) => Promise<any>) {
        const result = await this.readFromStream(options.streamName, options.readBlock || 2500);
        if (!result) {
            await new Promise(r => setTimeout(r, options.delay?.empty || 5000));
            setTimeout(() => this.readingLoop(options, processFunction), 1);
            return;
        }
        await processFunction(result);
        await new Promise(r => setTimeout(r, options.delay?.base || 100));
        setTimeout(() => this.readingLoop(options, processFunction), 1);
        return;
    }

    static startReadingLoop(options: ReadingLoopOptions, processFunction: (content: Record<string, string>) => Promise<any>) {
        this.readingLoop(options, processFunction)
    }

    private static async readFromStream(streamName: string, readBlock: number) {
        const result = await this.client.xRead({ id: '0', key: streamName }, { COUNT: 1, BLOCK: readBlock });
        if (!result) return;
        if (result.length == 0) return;
        if (!result[0].messages) return;
        if (result[0].messages.length == 0) return;
        const message = result[0].messages[0];
        await this.client.xDel(streamName, message.id);
        const content = message.message;
        return content;
    }

    static async addToStream(streamName: string, data: Record<string, string>) {
        const result = await this.client.xAdd(streamName, "*", data);
        return result;
    }

}
