
import { Chart, registerables } from 'chart.js';
import 'chartjs-chart-funnel';
import { FunnelController, FunnelChart, TrapezoidElement } from 'chartjs-chart-funnel';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default defineNuxtPlugin(() => {
    Chart.register(
        ...registerables,
        FunnelController, FunnelChart, TrapezoidElement, ChartDataLabels
    );

    Chart.defaults.set('plugins.datalabels', {
        display: false,
    });

})