
import * as fns from 'date-fns'
import dateServiceInstance, { Slice } from '~/shared/services/DateService';

export type AiToolTyped<FunctionName extends string, Args extends string[]> = {
    type: 'function',
    function: {
        name: FunctionName,
        description?: string,
        parameters: {
            type: string,
            required: Args[number][],
            properties: {
                [K in Args[number]]: {
                    type: string,
                    description: string,
                    items?: any
                }
            }
        },
        strict?: boolean | null
    }
}

export function getFirstAvailableSliceFromDates(from: string, to: string) {

    const fromTime = new Date(from).getTime();
    const toTime = new Date(to).getTime() + 1000;
    const days = fns.differenceInDays(toTime, fromTime);

    const keys = Object.keys(dateServiceInstance.sliceAvailabilityMap);

    const targetKey = keys.find((key: any) => {
        const data = ((dateServiceInstance.sliceAvailabilityMap as any)[key]) as [number, number];
        return days > data[0] && days < data[1];
    });

    return targetKey as Slice;

}


type AiPluginHandlerData<Args extends string[]> = { project_id: string } & { [K in Args[number]]: any }

export class AiPlugin<Name extends string = any, Args extends string[] = any> {
    constructor(
        public name: Name,
        public tool: AiToolTyped<Name, Args>,
        public handler: (data: AiPluginHandlerData<Args>) => any
    ) { }

}