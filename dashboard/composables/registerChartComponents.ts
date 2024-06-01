
import { Chart, registerables } from 'chart.js';

let registered = false;
export async function registerChartComponents() {
    if (registered) return;
    if (process.client) {
        Chart.register(...registerables);
        registered = true;
    }
}