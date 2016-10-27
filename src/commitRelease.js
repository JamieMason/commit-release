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
function create (options, done) {
  getVersion(options)
    .then(checkTagExists)
    .then(createCommit)
    .then(onSuccess, onError)
    .catch(onError);

  function onSuccess () {
    done(null, options);
  }

  function onError (message) {
    done(message);
  }
}

function checkTagExists (options) {
  if (!options.force) {
    return exec.shell('git', ['tag', '--list', options.version], options.verbose)
      .then(function (output) {
        if (output.trim() !== '') {
          return Promise.reject('A tag with name "' + options.version + '" already exists.');
        }
        return options;
      });
  }
  return options;
}

function createCommit (options) {
  // variables
  var logPath = path.resolve(options.directory, 'CHANGELOG.md');
  var force = options.force ? '--force' : '';
  var message = 'chore(release): ' + options.version;
  var verify = options.noVerify ? '--no-verify' : '';

  // actions
  var bump = exec.shell.bind(null, 'npm', ['version', options.version, '--no-git-tag-version', '--force'], options.verbose);
  var clearLog = exec.shell.bind(null, 'rm', ['-f', logPath], options.verbose);
  var writeLog = updateChangeLog.bind(null, options);
  var writeDependencies = updateDepsLog.bind(null, options);
  var stage = exec.shell.bind(null, 'git', ['add', '.', '-A'], options.verbose);
  var commit = exec.shell.bind(null, 'git', ['commit', '-m', message, verify], options.verbose);
  var doTag = exec.shell.bind(null, 'git', ['tag', options.version, force], options.verbose);
  var tag = !options.noTag ? doTag() : options;

  return checkVersion(options)
    .then(bump)
    .then(clearLog)
    .then(writeLog)
    .then(writeDependencies)
    .then(stage)
    .then(commit)
    .then(tag);
}

function checkVersion (options) {
  return new Promise(function (resolve, reject) {
    var pkgPath = path.resolve(options.directory, 'package.json');
    var pkg = require(pkgPath);
    if (options.version === pkg.version) {
      var error = new Error('Current version is already ' + options.version);
      reject(error);
    } else {
      resolve(options);
    }
  });
}

function updateChangeLog (options) {
  return new Promise(function (resolve, reject) {
    var writeStream = fs.createWriteStream(
      path.resolve(options.directory, 'CHANGELOG.md')
    );

    writeStream.on('finish',
      onWriteEnd
    );
    changelog({
      path: options.directory,
      preset: 'angular',
      releaseCount: 0
    }).pipe(writeStream);

    function onWriteEnd (err) {
      if (err) {
        reject(err);
      } else {
        resolve(options.version);
      }
    }
  });
}

function getVersion (options) {
  if (options.overrideVersion) {
    options.version = options.overrideVersion;
    return Promise.resolve(options);
  }
  return new Promise(function (resolve, reject) {
    crv.get(options, function (err, version) {
      if (err) {
        reject(err);
      } else {
        options.version = version;
        resolve(options);
      }
    });
  });
}

function updateDepsLog (options) {
  var directory = options.directory;
  var bin = require.resolve('package-json-to-readme');
  var pkgPath = path.resolve(directory, 'package.json');
  var logFile = path.resolve(directory, 'DEPENDENCIES.md');
  return exec.shell('node', [bin, '--no-footer', pkgPath], options.verbose)
    .then(function (logData) {
      fs.writeFileSync(logFile, logData);
    });
}
