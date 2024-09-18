import type { AuthContext } from "../middleware/01-authorization";
import type { EventHandlerRequest, H3Event } from 'h3'

export function getRequestUser(event: H3Event<EventHandlerRequest>) {
    if (!event.context.auth) return;
    return event.context.auth as AuthContext;
}

export function getRequestProjectId(event: H3Event<EventHandlerRequest>) {
    if (!event.context.params) return;
    return event.context.params['project_id'];
}

export function getRequestAddress(event: H3Event<EventHandlerRequest>) {
    if (process.dev) return '127.0.0.1';
    return event.headers.get('x-real-ip') || event.headers.get('X-Forwarded-For') || '0.0.0.0';
}