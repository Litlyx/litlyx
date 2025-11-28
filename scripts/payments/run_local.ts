import child from 'node:child_process';
import path from 'node:path';
import { PAYMENTS_SERVICE } from '../.config';

export function main() {

    const mode = process.argv[2];

    const paymentsFolder = path.join(__dirname, '../../payments');

    const getEnv = {
        '--production': PAYMENTS_SERVICE.getEnv_PRODUCTION(),
        '--testmode': PAYMENTS_SERVICE.getEnv_TESTMODE()
    }

    const env = getEnv[mode];

    if (!env) {
        console.error('use --production or --testmode')
        return;
    }

    const p = child.exec(`ts-node ${paymentsFolder}/src/index.ts`, { env });

    p.stdout.on('data', (e) => { console.log(e.toString()); });
    p.stderr.on('data', (e) => { console.log(e.toString()); })

}

main();