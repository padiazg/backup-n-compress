const { compressFolder } = require('./compress-unit');
const config = require('./tasks.json');

const backup = async () => {
    for (item of config.folders) {
        if (!item.folder)
            item.folder = process.cwd();

        // if there is not exclude pattern for the item, and the global exclude
        // pattern is defined, include it on the item
        if (item.exclude === undefined && config.exclude && config.exclude.length > 0) {
            item.exclude = config.exclude;
        }

        try {
            await compressFolder(item);
            console.log('hecho', item.folder);
        } catch(err) { console.error(err) }
    } // for (item of config)  ...
} // backup ...

backup();
