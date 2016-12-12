// modules
var exec = require('../exec');

// public
module.exports = bump;

// implementation
function bump(options) {
  return exec.shell('npm', ['version', options.version, '--no-git-tag-version', '--force'])
    .then(function () {
      return options;
    });
}
