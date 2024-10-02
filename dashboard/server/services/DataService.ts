import { VisitModel } from "@schema/metrics/VisitSchema";
import { EventModel } from "@schema/metrics/EventSchema";

import type { Model } from "mongoose";


export type TModelName = keyof typeof allowedModels;

export const allowedModels: Record<string, { model: Model<any> }> = {
    'events': {
        model: EventModel,
    },
    'visits': {
        model: VisitModel,
    }
}
