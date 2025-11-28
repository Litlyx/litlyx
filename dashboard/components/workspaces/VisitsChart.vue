<script lang="ts" setup>
import type { ChartData, ChartOptions } from 'chart.js';
import { useLineChart, LineChart } from 'vue-chart-3';

export type WorkspaceVisitChartData = {
    labels: string[],
    data: number[]
}

const props = defineProps<{ data: WorkspaceVisitChartData }>();


const chartOptions = shallowRef<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            ticks: { display: false },
            grid: {
                display: false,
                drawBorder: false,
                color: '#CCCCCC22',
            },
            beginAtZero: true,
        },
        x: {
            ticks: { display: false },
            offset: false,
            grid: {
                display: false,
                drawBorder: false,
                color: '#CCCCCC22',
            }
        }
    },
    plugins: {
        legend: { display: false },
        title: { display: false },
tooltip: {
  enabled: true,
  backgroundColor: '#000',
  titleColor: '#fff',
  bodyColor: '#eee',
  padding: 10,
  cornerRadius: 4,
  displayColors: false,
  callbacks: {
    label: function (context) {
      const value = context.parsed.y;
      return `${value} visits`;
    },
    title: function () {

      return ``;
    }
  }
}
    },
});

const chartData = shallowRef<ChartData<'line'>>({
    labels: props.data.labels,
    datasets: [{
        data: props.data.data,
        type: 'line',
        borderColor: '#7537F3',
        pointRadius: 4,
        pointHoverBackgroundColor: '#7537F3',
        pointHoverRadius:6,
        tension: 0.4
    }]
});


const { lineChartProps, lineChartRef } = useLineChart({ chartData, options: chartOptions });

</script>

<template>
    <LineChart v-if="chartData" ref="lineChartRef" v-bind="lineChartProps"> </LineChart>
</template>