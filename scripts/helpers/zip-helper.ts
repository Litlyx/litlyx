
import fs from 'fs-extra';
import archiver from 'archiver';


function handleEvents(archive: archiver.Archiver, output: fs.WriteStream) {

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
    });

    output.on('end', function () {
        console.log('Data has been drained');
    });

    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            console.error(err);
        } else {
            throw err;
        }
    });

    archive.on('error', function (err) {
        throw err;
    });
}

export function createZip(outPath: string) {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 2 } });
    handleEvents(archive, output);
    archive.pipe(output);
    return archive;
}