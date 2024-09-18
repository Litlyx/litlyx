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

    private static processed = 0;

    private static client = createClient({
        url: requireEnv("REDIS_URL"),
        username: requireEnv("REDIS_USERNAME"),
        password: requireEnv("REDIS_PASSWORD"),
        database: process.env.DEV_MODE === 'true' ? 1 : 0
    });

    static async connect() {
        await this.client.connect();
    }

    static async readFromStream(stream_name: string, group_name: string, consumer_name: string, process_function: (content: Record<string, string>) => Promise<any>) {

        const result: xReadGgroupResult = await this.client.xReadGroup(group_name, consumer_name, [{ key: stream_name, id: '>' }], { COUNT: 5, BLOCK: 10000 });

        if (!result) {
            setTimeout(() => this.readFromStream(stream_name, group_name, consumer_name, process_function), 10);
            return;
        }

        for (const entry of result) {
            for (const messageData of entry.messages) {
                await process_function(messageData.message);
                await this.client.xAck(stream_name, group_name, messageData.id);
                await this.client.set(`ACK:${group_name}`, messageData.id);
                RedisStreamService.processed++;
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

        setInterval(() => {
            if (RedisStreamService.processed > 0) {
                console.log('Processed:', (RedisStreamService.processed / 10).toFixed(2), '/s');
                RedisStreamService.processed = 0;
            }
        }, 10_000);

        console.log('Start reading loop')

        try {
            await this.client.xGroupCreate(options.stream_name, options.group_name, '0', { MKSTREAM: true });
        } catch (ex) {
            console.log('Group', options.group_name, 'already exist');
        }

        this.readFromStream(options.stream_name, options.group_name, options.consumer_name, processFunction);
    }

    static async addToStream(streamName: string, data: Record<string, string>) {
        const result = await this.client.xAdd(streamName, "*", data);
        return result;
    }

}
