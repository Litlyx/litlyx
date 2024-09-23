
import winston from 'winston';

const { combine, timestamp, json, errors } = winston.format;


const timestampFormat = () => { return new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' }); }

export const logger = winston.createLogger({
    format: combine(
        errors({ stack: true }),
        timestamp({
            format: timestampFormat
        }),
        json()
    ),
    exceptionHandlers: [
        new winston.transports.File({ filename: 'winston-logs.ndjson' }),
        new winston.transports.File({ filename: 'winston-exceptions.ndjson' }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'winston-logs.ndjson' }),
        new winston.transports.File({ filename: 'winston-rejections.ndjson' }),
    ],
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: combine(
                winston.format.colorize({ all: true }),
                errors({ stack: true }),
                timestamp({ format: timestampFormat }),
                winston.format.printf((info) => {
                    if (info instanceof Error) {
                        return `${info.timestamp} [${info.level}]: ${info.message}\n${info.stack}`;
                    } else {
                        return `${info.timestamp} [${info.level}]: ${info.message}`;
                    }
                })
            ),
        }),
        new winston.transports.File({ filename: 'winston-logs.ndjson' }),
        new winston.transports.File({
            level: 'debug',
            filename: 'winston-debug.ndjson'
        })
    ]
});