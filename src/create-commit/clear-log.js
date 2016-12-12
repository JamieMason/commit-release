// node modules
var path = require('path');

// modules
var childProcess = require('../lib/child-process');

// public
module.exports = clearLog;

// implementation
function clearLog(options) {
  return childProcess.exec('rm -f ' + path.resolve(options.directory, 'CHANGELOG.md'))
    .then(function () {
      return options;
    });
}
