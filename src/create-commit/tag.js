// modules
var childProcess = require('../lib/child-process');

// public
module.exports = tag;

// implementation
function tag(options) {
  var baseArgs = ['tag', options.version];
  var args = options.force ? baseArgs.concat('--force') : baseArgs;
  return childProcess.exec('git', args).then(function () {
    return options;
  });
}
