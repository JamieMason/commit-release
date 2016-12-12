// node modules
var path = require('path');

// modules
var exec = require('../exec');

// public
module.exports = clearLog;

// implementation
function clearLog(options) {
  return exec.shell('rm', ['-f', path.resolve(options.directory, 'CHANGELOG.md')])
    .then(function () {
      return options;
    });
}
