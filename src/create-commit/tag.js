// modules
var exec = require('../exec');

// public
module.exports = tag;

// implementation
function tag(options) {
  return exec.shell('git', ['tag', options.version, options.force ? '--force' : '']).then(function () {
    return options;
  });
}
