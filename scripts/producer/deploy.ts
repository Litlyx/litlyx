
import fs from 'fs-extra';
import path from 'path';
import child from 'child_process';
import { createZip } from '../helpers/zip-helper';
import { DeployHelper } from '../helpers/deploy-helper';
import { DATABASE_CONNECTION_STRING_PRODUCTION, DATABASE_CONNECTION_STRING_TESTMODE, REDIS_URL_PRODUCTION, REDIS_URL_TESTMODE, REMOTE_HOST_TESTMODE } from '../.config';

const TMP_PATH = path.join(__dirname, '../../tmp');
const LOCAL_PATH = path.join(__dirname, '../../producer');
const REMOTE_PATH = '/home/litlyx/producer';
const ZIP_NAME = 'producer.zip';

const MODE = DeployHelper.getMode();
const SKIP_BUILD = DeployHelper.getArgAt(0) == '--no-build';

console.log('Deploying producer in mode:', MODE);

setTimeout(() => { main(); }, 3000);

async function main() {

    if (fs.existsSync(TMP_PATH)) fs.rmSync(TMP_PATH, { force: true, recursive: true });
    fs.ensureDirSync(TMP_PATH);


    if (!SKIP_BUILD) {
        console.log('Building');
        child.execSync(`cd ${LOCAL_PATH} && pnpm run build`);
    }


    console.log('Creating zip file');
    const archive = createZip(TMP_PATH + '/' + ZIP_NAME);
    archive.directory(LOCAL_PATH + '/dist', '/dist');

    if (MODE === 'testmode') {
        const ecosystemContent = fs.readFileSync(LOCAL_PATH + '/ecosystem.config.js', 'utf8');
        const devContent = ecosystemContent
            .replace("$REDIS_URL$", `${REDIS_URL_TESTMODE}`)
            .replace("$MONGO_CONNECTION_STRING$", `${DATABASE_CONNECTION_STRING_TESTMODE}`)
            .replace("$DEV_MODE$", `true`);
        archive.append(Buffer.from(devContent), { name: '/ecosystem.config.js' });
    } else {
        const ecosystemContent = fs.readFileSync(LOCAL_PATH + '/ecosystem.config.js', 'utf8');
        const devContent = ecosystemContent
            .replace("$REDIS_URL$", `${REDIS_URL_PRODUCTION}`)
            .replace("$MONGO_CONNECTION_STRING$", `${DATABASE_CONNECTION_STRING_PRODUCTION}`)
            .replace("$DEV_MODE$", `false`);
        archive.append(Buffer.from(devContent), { name: '/ecosystem.config.js' });
    }


    archive.file(LOCAL_PATH + '/package.json', { name: '/package.json' });
    archive.file(LOCAL_PATH + '/pnpm-lock.yaml', { name: '/pnpm-lock.yaml' });
    await archive.finalize();

    await DeployHelper.connect();

    const { scp, ssh } = DeployHelper.instances();

    console.log('Creating remote structure');
    console.log('Check existing');
    const remoteExist = await scp.exists(REMOTE_PATH);
    console.log('Exist', remoteExist);
    if (remoteExist) {
        console.log('Deleting');
        await DeployHelper.execute(`rm -r ${REMOTE_PATH}`);
    }

    console.log('Creating folder');
    await scp.mkdir(REMOTE_PATH);

    console.log('Uploading zip file');
    await scp.uploadFile(TMP_PATH + '/' + ZIP_NAME, REMOTE_PATH + '/' + ZIP_NAME);
    scp.close();

    console.log('Cleaning local');
    fs.rmSync(TMP_PATH + '/' + ZIP_NAME, { force: true, recursive: true });

    console.log('Extracting remote');
    await DeployHelper.execute(`cd ${REMOTE_PATH} && unzip ${ZIP_NAME} && rm -r ${ZIP_NAME}`);

    console.log('Installing remote');
    await DeployHelper.execute(`cd ${REMOTE_PATH} && /root/.nvm/versions/node/v21.2.0/bin/pnpm i`);

    console.log('Executing remote');
    await DeployHelper.execute(`cd ${REMOTE_PATH} && /root/.nvm/versions/node/v21.2.0/bin/pm2 start ecosystem.config.js`);

    ssh.dispose();

}
