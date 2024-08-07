
import { createClient } from 'redis';

const runtimeConfig = useRuntimeConfig();

export const DATA_EXPIRE_TIME = 30;
export const TIMELINE_EXPIRE_TIME = 60 * 5;
export const COUNTS_EXPIRE_TIME = 10;

export const COUNTS_OLD_SESSIONS_EXPIRE_TIME = 60 * 5;
export const COUNTS_SESSIONS_EXPIRE_TIME = 60 * 3;

export const EVENT_NAMES_EXPIRE_TIME = 60;

export const EVENT_METADATA_FIELDS_EXPIRE_TIME = 120;


export class Redis {

    private static client = createClient({
        url: runtimeConfig.REDIS_URL,
        username: runtimeConfig.REDIS_USERNAME,
        password: runtimeConfig.REDIS_PASSWORD,
        database: process.dev ? 1 : 0,
    });

    static async init() {
        await this.client.connect();
        this.client.on('error', function (err) {
            console.error('Redis error:', err);
        });
    }

    static async setString(key: string, value: string, exp: number) {
        await this.client.set(key, value, { EX: exp });
    }


    static async set<T extends any>(key: string, value: T, exp: number) {
        const stringValue = JSON.stringify(value);
        this.setString(key, stringValue, exp);
    }

    static async getString(key: string) {
        return await this.client.get(key);
    }

    static async get<T extends any>(key: string): Promise<undefined | T> {
        const data = await this.getString(key);
        if (!data) return;
        return JSON.parse(data);
    }

    static async del(key: string) {
        await this.client.del(key);
    }

    static async useCache<T extends any>(options: { key: string, exp: number }, action: (noStore: () => void) => Promise<T>): Promise<T> {
        const cached = await this.get<T>(options.key);
        if (cached) return cached;
        let storeResult = true;
        const noStore = () => storeResult = false;
        const result = await action(noStore);
        if (!storeResult) return result;
        await this.set(options.key, result, options.exp);
        return result;
    }

}