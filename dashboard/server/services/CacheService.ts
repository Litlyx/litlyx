
import { createClient } from 'redis';

const runtimeConfig = useRuntimeConfig();

type UseCacheCallback<T> = (noStore: () => void, updateExp: (value: number) => void) => Promise<T>

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

    static async useCache<T extends any>(key: string, exp: number, callback: UseCacheCallback<T>) {
        const cached = await this.get<T>(key);
        if (cached) return cached;
        let expireValue = exp;
        let shouldStore = true;
        const noStore = () => shouldStore = false;
        const updateExp = (newExp: number) => expireValue = newExp;
        const result = await callback(noStore, updateExp);
        if (!shouldStore) return result;
        await this.set(key, result, expireValue);
        return result;
    }

}