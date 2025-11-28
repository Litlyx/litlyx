import type { Response } from "express";


export function sendJson(res: Response, status: number, data: Record<string, any>): void {
    res.status(status).json(data);
}