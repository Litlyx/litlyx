
import { AIPlugin } from "../Plugin";

export class AiComposableChart extends AIPlugin<['createComposableChart']> {
    constructor() {
        super({
            'createComposableChart': {
                handler: (data: { labels: string, points: number[] }) => {
                    return { ok: true };
                },
                tool: {
                    type: 'function',
                    function: {
                        name: 'createComposableChart',
                        description: 'Creates a chart based on the provided datasets',
                        parameters: {
                            type: 'object',
                            properties: {
                                labels: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Labels for each data point in the chart'
                                },
                                title: {
                                    type: 'string',
                                    description: 'Title of the chart to let user understand what is displaying, not include dates'
                                },
                                datasets: {
                                    type: 'array',
                                    description: 'List of datasets',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            chartType: {
                                                type: 'string',
                                                enum: ['line', 'bar'],
                                                description: 'The type of chart to display the dataset, either "line" or "bar"'
                                            },
                                            points: {
                                                type: 'array',
                                                items: { type: 'number' },
                                                description: 'Numerical values for each data point in the chart'
                                            },
                                            color: {
                                                type: 'string',
                                                description: 'Color used to represent the dataset in format "#RRGGBB"'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Name of the dataset'
                                            }
                                        },
                                        required: ['points', 'color', 'chartType', 'name'],
                                        description: 'Data points and style information for the dataset'
                                    }
                                }
                            },
                            required: ['labels', 'datasets', 'title']
                        }
                    }
                }
            }
        })
    }
}

export const AiComposableChartInstance = new AiComposableChart();
