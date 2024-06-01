export const defineEventHandler = (handler: Function) => handler;
(globalThis as any).defineEventHandler = (handler: any) => handler;