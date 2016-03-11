// 3rd party modules
var changelog = require('conventional-changelog');
var crv = require('conventional-recommended-version');
var fs = require('fs');
var path = require('path');

// modules
var exec = require('./exec');

// public
module.exports = {
    create: create
};

// implementation
function create(options, done) {
    getVersion(options)
        .then(checkTagExists)
        .then(createCommit)
        .catch(done);

    function checkTagExists(version) {
        if (!params.force) {
            return exec.shell('git tag --list ' + version)
                .then(function(output) {
                    if (output.trim() !== '') {
                        return Promise.reject('A tag with name "' + version + '" already exists.')
                    }
                    return version
                })
        }
        return version
    }

    function createCommit(version) {
        var params = {
            directory: options.directory,
            force: options.force,
            noVerify: options.noVerify,
            postfix: options.postfix,
            version: version
        };
        var logPath = path.resolve(params.directory, 'CHANGELOG.md');
        var bump = exec.shell.bind(null, 'npm version ' + version + ' --no-git-tag-version --force');
        var clearLog = exec.shell.bind(null, 'rm -f ' + logPath);
        var writeLog = updateChangeLog.bind(null, params);
        var writeDependencies = updateDepsLog.bind(null, options.directory);
        var stage = exec.shell.bind(null, 'git add . -A');
        var commit = exec.shell.bind(null, 'git commit -m "chore(release): ' + version + '"' + (params.noVerify ? ' --no-verify' : ''));
        var tag = exec.shell.bind(null, 'git tag ' + version + (params.force ? ' --force' : ''));

        return checkVersion(params)
            .then(bump)
            .then(clearLog)
            .then(writeLog)
            .then(writeDependencies)
            .then(stage)
            .then(commit)
            .then(tag)
            .then(onSuccess, onError);

        function onSuccess() {
            done(null, version);
        }

        function onError(message) {
            done(message);
        }
    }
}

function checkVersion(params) {
    return new Promise(function(resolve, reject) {
        var pkgPath = path.resolve(params.directory, 'package.json');
        var pkg = require(pkgPath);
        if (params.version === pkg.version) {
            var error = new Error('Current version is already ' + params.version);
            reject(error);
        } else {
            resolve(params.version);
        }
    });
}

function updateChangeLog(params) {
    return new Promise(function(resolve, reject) {
        var writeStream = fs.createWriteStream(
            path.resolve(params.directory, 'CHANGELOG.md')
        );

        writeStream.on('finish',
            onWriteEnd
        );
        changelog({
            path: params.directory,
            preset: 'angular',
            releaseCount: 0
        }).pipe(writeStream);

        function onWriteEnd(err) {
            if (err) {
                reject(err);
            } else {
                resolve(params.version);
            }
        }
    });
}

function getVersion(params) {
    if (params.overrideVersion) {
        return Promise.resolve(params.overrideVersion);
    }
    return new Promise(function(resolve, reject) {
        crv.get(params, function(err, version) {
            if (err) {
                reject(err);
            } else {
                resolve(version);
            }
        });
    });
}

function updateDepsLog(directory) {
    var bin = require.resolve('package-json-to-readme');
    var pkgPath = path.resolve(directory, 'package.json');
    var logFile = path.resolve(directory, 'DEPENDENCIES.md');
    return exec.shell(bin + ' --no-footer ' + pkgPath)
        .then(function(logData) {
            fs.writeFileSync(logFile, logData);
        });
}
