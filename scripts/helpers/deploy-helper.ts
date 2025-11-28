
import { Client, ScpClient } from 'node-scp';
import { NodeSSH } from 'node-ssh'
import fs from 'fs-extra';
import { REMOTE_HOST_PRODUCTION, REMOTE_HOST_TESTMODE, IDENTITY_FILE } from '../.config'


export const MODES_ARRAY = ['production', 'testmode', 'testlive'] as const;

export type MODE = typeof MODES_ARRAY[number];

export class DeployHelper {

    private static scpClient: ScpClient;
    private static sshClient: NodeSSH;

    static getMode(): MODE {
        const argvMode = process.argv[2];
        if (!argvMode) {
            console.error('use', MODES_ARRAY.map(e => `--${e}`).join(' or '));
            process.exit(0);
        }
        const mode = argvMode.replace('--', '');
        if (!MODES_ARRAY.includes(mode as any)) {
            console.error('use', MODES_ARRAY.map(e => `--${e}`).join(' or '));
            process.exit(0);
        }
        return mode as MODE;
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

