


class PerformanceThing {
    public min: number = Infinity;
    public max: number = -Infinity;
    private things: number[] = [];
    private slice: number = 0;
    constructor(public id: string, private maxThings: number) { }
    start() { this.slice = performance.now(); }
    stop() {
        const time = performance.now() - this.slice;
        if (time > this.max) this.max = time;
        if (time < this.min) this.min = time;
        this.things.push(time);
        if (this.things.length > this.maxThings) {
            this.things.shift();
        }
        return time;
    }
    avg() {
        return this.things.reduce((a, e) => a + e, 0) / this.things.length;
    }

    print() {
        console.log(`${this.id} | Avg: ${this.avg().toFixed(0)} ms | Min: ${this.min.toFixed(0)} ms | Max: ${this.max.toFixed(0)} ms`)
    }
    get data() { return this.things; }
}

export class PerformanceService {
    static create(id: string, maxThings: number = 100) {
        const thing = new PerformanceThing(id, maxThings);
        return thing;
    }
}