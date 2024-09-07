import { createClient } from 'redis';
import { requireEnv } from '../utilts/requireEnv';

export type ReadingLoopOptions = {
    delay?: {
        base?: number,
        empty?: number
    },
    readBlock?: number,
    streamName: string,
    consumer?: string
}

export class RedisStreamService {

    private static processed = 0;

    private static client = createClient({
        url: requireEnv("REDIS_URL"),
        username: requireEnv("REDIS_USERNAME"),
        password: requireEnv("REDIS_PASSWORD"),
        database: process.env.DEV_MODE === 'true' ? 1 : 0
    });

    static async connect() {
        console.log('RedisStreamService DEV_MODE=', process.env.DEV_MODE === 'true');
        await this.client.connect();


    }

    private static async readingLoop(options: ReadingLoopOptions, processFunction: (content: Record<string, string>) => Promise<any>) {
        const result = await this.readFromStream(options.streamName, options.readBlock || 2500, options.consumer || 'base_consumer');
        if (!result) {
            await new Promise(r => setTimeout(r, options.delay?.empty || 5000));
            setTimeout(() => this.readingLoop(options, processFunction), 1);
            return;
        }
        await processFunction(result);
        RedisStreamService.processed++;
        await new Promise(r => setTimeout(r, options.delay?.base || 100));
        setTimeout(() => this.readingLoop(options, processFunction), 1);
        return;
    }

    static async startReadingLoop(options: ReadingLoopOptions, processFunction: (content: Record<string, string>) => Promise<any>) {

        setInterval(() => {
            console.log('Processed:', (RedisStreamService.processed / 30).toFixed(), '/s');
            RedisStreamService.processed = 0;
        }, 30_000)
        
        try {
            console.log('Start reading loop');
            await this.client.xGroupCreate(options.streamName, 'broker', '0', { MKSTREAM: true, });
            console.log('Reading loop started');
        } catch (ex) {
            console.error(ex);
        }

        this.readingLoop(options, processFunction)
    }

    private static async readFromStream(streamName: string, readBlock: number, consumer: string) {
        const result = await this.client.xReadGroup(
            'broker', consumer,
            [{ key: streamName, id: '>' }],
            { COUNT: 1, BLOCK: readBlock }
        );
        if (!result) return;
        if (result.length == 0) return;
        if (!result[0].messages) return;
        if (result[0].messages.length == 0) return;
        const message = result[0].messages[0];
        await this.client.xAck(streamName, 'broker', message.id);
        await this.client.xDel(streamName, message.id);
        const content = message.message;
        return content;
    }

    static async addToStream(streamName: string, data: Record<string, string>) {
        const result = await this.client.xAdd(streamName, "*", data);
        return result;
    }

}
