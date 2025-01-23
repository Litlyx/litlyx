
const path = require('path');
const fs = require('fs');

const dashboardPath = path.join(__dirname, '../../dashboard');

const logNames = [
    "winston-debug.ndjson",
    "winston-exceptions.ndjson",
    "winston-logs.ndjson",
    "winston-rejections.ndjson",
]

for (const logName of logNames) {
    const logFullPath = path.join(dashboardPath, logName);
    fs.rmSync(logFullPath);
}