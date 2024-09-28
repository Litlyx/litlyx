

import type { H3Event, EventHandlerRequest } from 'h3';


export function useCors(event: H3Event<EventHandlerRequest>) {
    setResponseHeader(event, 'Access-Control-Allow-Origin', '*');
    setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');
}