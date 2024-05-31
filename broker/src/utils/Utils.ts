import { Request } from "express";
import crypto from 'crypto';

export function getIPFromRequest(req: Request) {
    const ip = req.header('X-Real-IP') || req.header('X-Forwarded-For') || '0.0.0.0';
    return ip;
}


export function createSessionHash(website: string, ip: string, userAgent: string) {
    const dailySalt = new Date().toLocaleDateString('it-IT');
    const sessionClean = dailySalt + website + ip + userAgent;
    const sessionHash = crypto.createHash('md5').update(sessionClean).digest("hex");
    return sessionHash;
}