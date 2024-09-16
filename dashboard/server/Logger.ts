
import winston from 'winston';

const { combine, timestamp, json, errors } = winston.format;



export const logger = winston.createLogger({
    format: combine(
        errors({ stack: true }),
        timestamp({
            format: 'DD-MM-YYYY hh:mm:ss'
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
            format: combine(
                winston.format.colorize({ all: true }),
                errors({ stack: true }),
                timestamp({ format: 'DD-MM-YYYY hh:mm:ss' }),
                winston.format.printf((info) => {
                    if (info instanceof Error) {
                        return `${info.timestamp} [${info.level}]: ${info.message}\n${info.stack}`;
                    } else {
                        return `${info.timestamp} [${info.level}]: ${info.message}`;
                    }
                })
            ),
        }),
        new winston.transports.File({ filename: 'winston-logs.ndjson' })
    ]
});