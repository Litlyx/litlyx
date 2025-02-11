
import fs from 'fs';
import path from 'path';

const dashboardPath = path.join(__dirname, '../../dashboard');

const logNames = [
    "winston-debug.ndjson",
    "winston-exceptions.ndjson",
    "winston-logs.ndjson",
    "winston-rejections.ndjson",
]

for (const logName of logNames) {
    const logFullPath = path.join(dashboardPath, logName);
    if (fs.existsSync(logFullPath)) fs.rmSync(logFullPath);
}