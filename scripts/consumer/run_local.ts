import child from 'node:child_process';
import path from 'node:path';
import { CONSUMER } from '../.config';

export function main() {

    const mode = process.argv[2];

    const consumerFolder = path.join(__dirname, '../../consumer');

    const getEnv = {
        '--production': CONSUMER.getEnv_PRODUCTION(),
        '--testmode': CONSUMER.getEnv_TESTMODE()
    }

    const env = getEnv[mode];

    if (!env) {
        console.error('use --production or --testmode')
        return;
    }

    const p = child.exec(`ts-node ${consumerFolder}/src/index.ts`, { env });

    p.stdout.on('data', (e) => { console.log(e.toString()); });
    p.stderr.on('data', (e) => { console.log(e.toString()); })

}

main();