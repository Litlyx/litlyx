
import fs from 'fs-extra';
import path from 'path';
import child from 'child_process';
import prettier from 'prettier';
import { createZip } from '../helpers/zip-helper';
import { DeployHelper } from '../helpers/deploy-helper';
import { EMAILS_SERVICE, getEcosystemContent } from '../.config';

const TMP_PATH = path.join(__dirname, '../../tmp');
const LOCAL_PATH = path.join(__dirname, '../../emails');
const REMOTE_PATH = '/home/litlyx/emails';
const ZIP_NAME = 'emails.zip';

const MODE = DeployHelper.getMode();
const SKIP_BUILD = DeployHelper.getArgAt(0) == '--no-build';

console.log('Deploying mail-service in mode:', MODE);

setTimeout(() => { main(); }, 3000);

async function main() {

    if (fs.existsSync(TMP_PATH)) fs.rmSync(TMP_PATH, { force: true, recursive: true });
    fs.ensureDirSync(TMP_PATH);

    if (!SKIP_BUILD) {
        console.log('Building');
        try {
            child.execSync(`cd ${LOCAL_PATH} && pnpm run build`);
        } catch (ex) {
            console.log(ex.output.map(e => {
                return e?.toString();
            }))
            console.error('Error during build process');
            process.exit();
        }
    }

    console.log('Creating zip file');
    const archive = createZip(TMP_PATH + '/' + ZIP_NAME);
    archive.directory(LOCAL_PATH + '/dist', '/dist');

    const envObject =
        MODE === 'testmode' ? EMAILS_SERVICE.getEnv_TESTMODE() :
            MODE === 'testlive' ? EMAILS_SERVICE.getEnv_TESTLIVE() :
                EMAILS_SERVICE.getEnv_PRODUCTION();

    const ecosystemContentRaw = getEcosystemContent('email-service', 3020, 'cluster', 1, './dist/src/index.js', envObject);
    const ecosystemContent = await prettier.format(ecosystemContentRaw, { parser: 'babel' });
    archive.append(Buffer.from(ecosystemContent), { name: '/ecosystem.config.js' });

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

    await DeployHelper.execute(`cd ${REMOTE_PATH} && /root/.nvm/versions/node/v21.2.0/bin/pm2 start ecosystem.config.js`);

    ssh.dispose();

}
