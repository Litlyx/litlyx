
import { Client, ScpClient } from 'node-scp';
import { NodeSSH } from 'node-ssh'
import fs from 'fs-extra';
import { REMOTE_HOST, IDENTITY_FILE } from '../.config'

export class DeployHelper {

    private static scpClient: ScpClient;
    private static sshClient: NodeSSH;

    static async connect() {
        this.scpClient = await Client({
            host: REMOTE_HOST,
            username: 'root',
            privateKey: fs.readFileSync(IDENTITY_FILE)
        })
        this.sshClient = new NodeSSH();
        await this.sshClient.connect({
            host: REMOTE_HOST,
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

