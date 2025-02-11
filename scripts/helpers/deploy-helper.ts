
import { Client, ScpClient } from 'node-scp';
import { NodeSSH } from 'node-ssh'
import fs from 'fs-extra';
import { REMOTE_HOST_PRODUCTION, REMOTE_HOST_TESTMODE, IDENTITY_FILE } from '../.config'

export class DeployHelper {

    private static scpClient: ScpClient;
    private static sshClient: NodeSSH;

    static getMode() {
        const argvMode = process.argv[2]
        if (argvMode != '--production' && argvMode != '--testmode') {
            console.error('use --production or --testmode');
            process.exit(0);
        }
        const MODE = argvMode === '--production' ? 'production' : 'testmode';
        return MODE;
    }

    static getArgAt(index: number) {
        return process.argv[3 + index];
    }


    static async connect() {
        this.scpClient = await Client({
            host: this.getMode() === 'production' ? REMOTE_HOST_PRODUCTION : REMOTE_HOST_TESTMODE,
            username: 'root',
            privateKey: fs.readFileSync(IDENTITY_FILE)
        })
        this.sshClient = new NodeSSH();
        await this.sshClient.connect({
            host: this.getMode() === 'production' ? REMOTE_HOST_PRODUCTION : REMOTE_HOST_TESTMODE,
            username: 'root',
            privateKeyPath: IDENTITY_FILE
        });
    }

    static async execute(command: string) {
        const res = await this.sshClient.execCommand(command);
        console.log(res);
    }

    static instances() {
        return { scp: this.scpClient, ssh: this.sshClient }
    }

}

