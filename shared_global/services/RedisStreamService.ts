import { createClient } from 'redis';
import { requireEnv } from '../utils/requireEnv';

export type ReadingLoopOptions = {
    stream_name: string,
    group_name: ConsumerGroup,
    consumer_name: string
}

type xReadGroupMessage = { id: string, message: { [x: string]: string } }
type xReadGgroupResult = { name: string, messages: xReadGroupMessage[] }[] | null

const consumerGroups = ['DATABASE'] as const;

type ConsumerGroup = typeof consumerGroups[number];


export class RedisStreamService {

    private static client = createClient({
        url: requireEnv("REDIS_URL"),
        username: requireEnv("REDIS_USERNAME"),
        password: requireEnv("REDIS_PASSWORD"),
        database: process.env.DEV_MODE === 'true' ? 1 : 0
    });


    private static METRICS_MAX_ENTRIES = 1000;
    private static METRICS_MAX_ENTRIES_PRODUCER = 1000;

    static async METRICS_onProcess(id: string, time: number) {
        const key = `___dev_metrics`;
        await this.client.lPush(key, `${id}:${time.toString()}`);
        await this.client.lTrim(key, 0, this.METRICS_MAX_ENTRIES - 1);
    }

    static async METRICS_get() {
        const key = `___dev_metrics`;
        const data = await this.client.lRange(key, 0, -1);
        return data.map(e => e.split(':')) as [string, string][];
    }

    static async METRICS_PRODUCER_onProcess(id: string, time: number) {
        const key = `___dev_metrics_producer`;
        await this.client.lPush(key, `${id}:${time.toString()}`);
        await this.client.lTrim(key, 0, this.METRICS_MAX_ENTRIES_PRODUCER - 1);
    }

    static async METRICS_PRODUCER_get() {
        const key = `___dev_metrics_producer`;
        const data = await this.client.lRange(key, 0, -1);
        return data.map(e => e.split(':')) as [string, string][];
    }


    static async connect() {
        await this.client.connect();
    }


    static async getQueueInfo(stream_name: string) {
        try {
            const size = await this.client.xLen(stream_name);
            return size;
        } catch (ex) {
            console.error(ex);
            return 0;
        }
    }

    static async readFromStream(stream_name: string, group_name: string, consumer_name: string, process_function: (content: Record<string, string>) => Promise<any>) {

        const result: xReadGgroupResult = await this.client.xReadGroup(group_name, consumer_name, [{ key: stream_name, id: '>' }], { COUNT: 5, BLOCK: 2000 });

        if (!result) {
            setTimeout(() => this.readFromStream(stream_name, group_name, consumer_name, process_function), 10);
            return;
        }

        for (const entry of result) {
            for (const messageData of entry.messages) {
                await process_function(messageData.message);
                await this.client.xAck(stream_name, group_name, messageData.id);
                await this.client.set(`ACK:${group_name}`, messageData.id);
            }
        }

        await this.trimStream(stream_name);

        setTimeout(() => this.readFromStream(stream_name, group_name, consumer_name, process_function), 10);
        return;

    }

    private static async trimStream(stream_name: string) {

        let lastMessageAck = '0';

        for (const consumerGroup of consumerGroups) {
            const lastAck = await this.client.get(`ACK:${consumerGroup}`);
            if (!lastAck) continue;
            if (lastAck > lastMessageAck) lastMessageAck = lastAck;
        }

        await this.client.xTrim(stream_name, 'MINID', lastMessageAck as any);

    }

    static async startReadingLoop(options: ReadingLoopOptions, processFunction: (content: Record<string, string>) => Promise<any>) {

        if (!consumerGroups.includes(options.group_name)) return console.error('GROUP NAME NOT ALLOWED');

        console.log('Start reading loop')

        try {
            await this.client.xGroupCreate(options.stream_name, options.group_name, '0', { MKSTREAM: true });
        } catch (ex) {
            console.log('Group', options.group_name, 'already exist');
        }

        this.readFromStream(options.stream_name, options.group_name, options.consumer_name, processFunction);
    }

    static async addToStream(streamName: string, data: Record<string, string>) {
        const result = await this.client.xAdd(streamName, "*", { ...data, timestamp: Date.now().toString() });
        return result;
    }

}
