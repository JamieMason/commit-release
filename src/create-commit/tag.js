// 3rd party modules
var when = require('when');

// modules
var childProcess = require('../lib/child-process');

// public
module.exports = tag;

// implementation
function tag(options) {
  if (options.noTag) {
    return when.resolve(options);
  }
  return childProcess.exec('git tag ' + options.version + (options.force ? ' --force' : '')).then(function () {
    return options;
  });
}
