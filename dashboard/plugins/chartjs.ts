
import { Chart, registerables } from 'chart.js';
import annotaionPlugin from 'chartjs-plugin-annotation';
import 'chartjs-chart-funnel';

import { FunnelController, FunnelChart, TrapezoidElement } from 'chartjs-chart-funnel';

export default defineNuxtPlugin(() => {
    Chart.register(...registerables, annotaionPlugin, FunnelController, FunnelChart, TrapezoidElement);
})