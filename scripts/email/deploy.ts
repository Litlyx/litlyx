
import fs from 'fs-extra';
import path from 'path';
import { createZip } from '../helpers/zip-helper';
import { DeployHelper } from '../helpers/deploy-helper';

const MODE = process.env.MODE;
const isProduction = MODE === 'prod';

if (MODE === 'prod') {
    console.error('production mode not implemented yet')
    process.exit();
}

const TMP_PATH = path.join(__dirname, '../../tmp');

const LOCAL_PATH = path.join(__dirname, '../../email');

const REMOTE_PATH = '/home/testmode/litlyx/email';

async function main() {

    if (fs.existsSync(TMP_PATH)) fs.rmSync(TMP_PATH, { force: true, recursive: true });
    fs.ensureDirSync(TMP_PATH);

    const archive = createZip(TMP_PATH + '/email.zip');
    archive.directory(LOCAL_PATH + '/dist', '/dist');

    const ecosystemContent = fs.readFileSync(LOCAL_PATH + '/ecosystem.config.js', 'utf8');
    const devContent = ecosystemContent.replace(/name: '(.*?)'/, "name: 'test-$1'");
    archive.append(Buffer.from(devContent), { name: '/ecosystem.config.js' })

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
    await scp.uploadFile(TMP_PATH + '/email.zip', REMOTE_PATH + '/email.zip');
    scp.close();

    console.log('Cleaning local');
    fs.rmSync(TMP_PATH + '/email.zip', { force: true, recursive: true });

    console.log('Extracting remote');
    await DeployHelper.execute(`cd ${REMOTE_PATH} && unzip email.zip && rm -r email.zip`);

    console.log('Installing remote');
    await DeployHelper.execute(`cd ${REMOTE_PATH} && /root/.nvm/versions/node/v21.2.0/bin/pnpm i`);

    await DeployHelper.execute(`cd ${REMOTE_PATH} && /root/.nvm/versions/node/v21.2.0/bin/pm2 start ecosystem.config.js`);

    ssh.dispose();


}

main();