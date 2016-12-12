// node modules
var fs = require('fs');
var path = require('path');

// 3rd party modules
var pathToPackageJsonToReadme = require.resolve('package-json-to-readme');

// modules
var exec = require('../exec');

// public
module.exports = updateDependencyLog;

// implementation
function updateDependencyLog(options) {
  var pkgPath = path.resolve(options.directory, 'package.json');
  var logFile = path.resolve(options.directory, 'DEPENDENCIES.md');
  return exec.shell('node', [pathToPackageJsonToReadme, '--no-footer', pkgPath])
    .then(function (logData) {
      fs.writeFileSync(logFile, logData);
      return options;
    });
}
