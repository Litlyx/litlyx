
import fs from 'fs-extra';
import path from 'path';
import child from 'child_process';
import { createZip } from '../helpers/zip-helper';
import { DeployHelper } from '../helpers/deploy-helper';

const TMP_PATH = path.join(__dirname, '../../tmp');
const LOCAL_PATH = path.join(__dirname, '../../dashboard');
const REMOTE_PATH = '/home/testmode/litlyx/dashboard';
const ZIP_NAME = 'dashboard.zip';
const TESTMODE_PORT = "4010";

const argvMode = process.argv[2]

if (argvMode != '--production' && argvMode != '--testmode') {
    console.error('use --production or --testmode');
    process.exit(1);
}
const MODE = argvMode === '--production' ? 'production' : 'testmode';

console.log('Deploying dashboard in mode:', MODE);

setTimeout(() => { main(); }, 3000);

async function main() {

    if (fs.existsSync(TMP_PATH)) fs.rmSync(TMP_PATH, { force: true, recursive: true });
    fs.ensureDirSync(TMP_PATH);

    // console.log('Building');
    // child.execSync(`cd ${LOCAL_PATH} && pnpm i && pnpm run build`)

    console.log('Creting zip file');
    const archive = createZip(TMP_PATH + '/' + ZIP_NAME);
    archive.directory(LOCAL_PATH + '/.output', '/.output');

    if (MODE === 'testmode') {
        const ecosystemContent = fs.readFileSync(LOCAL_PATH + '/ecosystem.config.js', 'utf8');
        const devContent = ecosystemContent.replace(/name: '(.*?)'/, "name: 'test-$1'").replace(/3010/, TESTMODE_PORT);
        archive.append(Buffer.from(devContent), { name: '/ecosystem.config.js' });
    } else {
        archive.file(LOCAL_PATH + '/ecosystem.config.js', { name: '/ecosystem.config.js' })
    }
    // archive.file(LOCAL_PATH + '/.env', { name: '/.env' });
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

    // console.log('Installing remote');
    // await DeployHelper.execute(`cd ${REMOTE_PATH} && /root/.nvm/versions/node/v21.2.0/bin/pnpm i`);

    // await DeployHelper.execute(`cd ${REMOTE_PATH} && /root/.nvm/versions/node/v21.2.0/bin/pm2 start ecosystem.config.js`);

    ssh.dispose();


}
