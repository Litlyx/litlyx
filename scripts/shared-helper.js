
const path = require('path');
const fs = require('fs');


class SharedHelper {

    static getSharedPath() {
        return path.join(__dirname, '../shared_global');
    }

    constructor(localSharedPath) {
        this.localSharedPath = localSharedPath;
    }

    clear() {
        if (fs.existsSync(this.localSharedPath)) {
            fs.rmSync(this.localSharedPath, { force: true, recursive: true });
            fs.mkdirSync(this.localSharedPath);
        }
    }

    create(name) {
        const localFolder = path.join(this.localSharedPath, name);
        fs.mkdirSync(localFolder);
    }

    copy(name) {
        const localSharedFile = path.join(this.localSharedPath, name);
        fs.cpSync(SharedHelper.getSharedPath(), localSharedFile);
    }

}




module.exports = {
    SharedHelper
}