
import path from 'path';
import fs from 'fs';


export class SharedHelper {

    constructor(private localSharedPath: string) { }

    static getSharedPath() { return path.join(__dirname, '../../shared_global'); }
    
    clear() {
        if (fs.existsSync(this.localSharedPath)) {
            fs.rmSync(this.localSharedPath, { force: true, recursive: true });
        }
        fs.mkdirSync(this.localSharedPath);
    }

    create(name: string) {
        const localFolder = path.join(this.localSharedPath, name);
        fs.mkdirSync(localFolder);
    }

    copy(name: string) {
        const localSharedFile = path.join(this.localSharedPath, name);
        const sharedFile = path.join(SharedHelper.getSharedPath(), name);
        fs.cpSync(sharedFile, localSharedFile);
    }

    copyFolder(name: string) {
        const localFolder = path.join(this.localSharedPath, name);
        const sharedFolder = path.join(SharedHelper.getSharedPath(), name);
        fs.cpSync(sharedFolder, localFolder, { force: true, recursive: true });
    }

}
