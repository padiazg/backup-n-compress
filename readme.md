# node.js Backup & Compress
Simple backup and compress project intended to compress every subfolder in a specified folder in a separate zip file.

This project was born when Google released "Backup and Sync" and give us the possibility to have sync folders for each machine.

First I started doing my backups manually, days later ended doing this project.

* A task backups an entire origin folder to an output folder.
* Each subfolder in the origin folder is compresses as a separate zip file in the output folder.
* Can define multiple tasks.
* Can define exclusion patterns, globally and for each task.

## Installation
```
$ git clone https://github.com/padiazg/backup-n-compress.git
$ cd backup-n-compress
$ npm install
```
## Run
Make sure you have set your tasks, see Configuration bellow.  
To run the backup
```
$ node index.js

or

$ node .
```
## Configuration
You must specify tasks in a file named tasks.json. There is a task.sample.json you can use as a guide.

The structure of the file is
```
{
    "exclude": [ <Array of strings> ],
    "tasks" : [ <Array of tasks> ]
}
```
The exclude item follows the [glob](https://github.com/isaacs/node-glob) ignore pattern, as glob is used by the [archiver](https://github.com/archiverjs/node-archiver) module to build the files list to compress.

Each task is defined as
```JSON
{
    "folder": "/where/origin/folder/is/",
    "outputFolder": "/where/to/put/the/backup/"
}

or

{
    "folder": "/where/origin/folder/is/",
    "outputFolder": "/where/to/put/the/backup/",
    "exclude": [
        "**/*.exe",
        "**/*.zip",
        "**/*.rar",
        "**/*.tar",
        "**/*.bin"
    ]
}
```
Full example
```json
{
    "exclude": [
        "**/node_modules/**",
        "./node_modules/**",
        "**/*.exe",
        "**/*.zip",
        "**/*.rar"
    ],
    "folders" : [
        {
            "folder": "C:/Users/pato/workspace/nodejs/",
            "outputFolder": "C:/Users/pato/workspace/backup/nodejs/"
        },
        {
            "folder": "C:/Users/pato/workspace/electron/",
            "outputFolder": "C:/Users/pato/workspace/backup/electron/"
        },
        {
            "folder": "C:/Users/pato/workspace/docker/",
            "outputFolder": "C:/Users/pato/workspace/backup/docker/",
            "exclude": [
                "**/*.exe",
                "**/*.zip",
                "**/*.rar",
                "**/*.tar",
                "**/*.bin"
            ]
        }
    ]
}
```
In both cases, _global_ and _folder specific_, the "exclude" option is optional.

If _folder specific_ "exclude" is present, it overrides the _global_ option.

If _folder specific_ "exclude" is an empty array, it means that you what to disable the exclusion pattern for that task.
```json
In this example the second task will not use any exclusion pattern.

{
    "exclude": [
        "**/*.exe",
        "**/*.zip",
        "**/*.rar"
    ],
    "folders" : [
        {
            "folder": "C:/Users/pato/workspace/nodejs/",
            "outputFolder": "C:/Users/pato/workspace/backup/nodejs/"
        },
        {
            "folder": "C:/Users/pato/workspace/docker/",
            "outputFolder": "C:/Users/pato/workspace/backup/docker/",
            "exclude": []
        }
    ]
}
```
## Contact
Patricio Díaz  
<padiazg@gmail.com>  
[Twitter](https://twitter.com/padiazg)
