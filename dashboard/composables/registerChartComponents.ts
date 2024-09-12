
import { Chart, registerables } from 'chart.js';
import annotaionPlugin from 'chartjs-plugin-annotation';

let registered = false;
export async function registerChartComponents() {
    if (registered) return;
    if (process.client) {
        Chart.register(...registerables, annotaionPlugin);
        registered = true;
    }
}