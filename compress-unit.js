
/*

    https://github.com/jprichardson/node-fs-extra
    https://github.com/isaacs/node-glob
    https://github.com/archiverjs/node-archiver
*/

const fs       = require('fs-extra');
const archiver = require('archiver');
const glob     = require("glob");

/**
 * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript#18650828
 */
const bytesToSize = bytes => {
    if (bytes == 0) return '0 Byte';
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
};

const doTask = task => {
    //console.log('* task =>', JSON.stringify(task, null, 2) );
    return new Promise((resolve, reject) => {
        const {
            folder = process.cwd(),
            outputFolder,
            outputName,
            exclude
        } = task;

        if (!outputFolder || !outputName)
            reject(new Error('Output folder or file name not defined'));

        // make sure that destination folder exists
        fs.ensureDir(outputFolder, err => { if (err) { reject(err); } });

        process.stdout.write(`+ ${outputName} `);

        const outputFileName = outputFolder + outputName;
        // create output file stream
        const outFile    = fs.createWriteStream(outputFileName);
        outFile.on('close', resolve);
        outFile.on('error', err => reject(err));

        // create zip
        const zipArchive = archiver('zip');
        zipArchive.pipe(outFile);
        zipArchive.on('error', err => reject(err));

        let lastCount = 0;
        zipArchive.on('progress', progress => {
            // the idea is to print one dot per Mb processes
            const difference = progress.fs.processedBytes - lastCount;
            if (difference >= 1048576) { // 1024*1024 = 1048576
                // calculate one dot per Mb of difference
                const dots = Math.round(difference/(1024*1024));
                // print the dots
                for (let i=0; i<dots; i++)
                    process.stdout.write(".");
                lastCount = progress.fs.processedBytes; // update the carrier
            } // if (difference >= (1024*1024)) ...
        }); // on/progress ...

        zipArchive.on('end', () => {
            const archiveSize = zipArchive.pointer();
            console.log(` ${bytesToSize(archiveSize)}`);
        }); // on/end ...

        // select files using glob
        const includeFilter = "**/*";
        const globOptions = {
            ignore: exclude,
            cwd: folder
        };

        zipArchive.glob(includeFilter, globOptions);
        zipArchive.finalize();
    }); // Promise ...
} // doTask ...

const compressFolder = compressFolderOptions => {
    return new Promise((resolve, reject) => {
        const {
            folder,
            outputFolder,
            exclude
        } = compressFolderOptions;

        console.log('procesando', folder);

        const options = { cwd: folder };

        glob("*/", options, async (error, foldersList) => {
            if (error) reject(error);

            for (let currentFolder of foldersList) {
                // strip trailing backslash if any
                currentFolder = currentFolder.replace('/', '');

                const task = {
                    folder: `${folder}/${currentFolder}/`,
                    outputFolder,
                    outputName: `${currentFolder}.zip`,
                    exclude
                }; // task ...

                try {
                    await doTask(task);
                } catch (err) {
                    reject(err);
                } // try/catch ...
            } // for (let folder of folders) ...

            resolve();  // if we get here, just resolve as completed ...
        }); // glob ...
    }); // Promise ...
} // compressFolder ...

module.exports = { compressFolder }
