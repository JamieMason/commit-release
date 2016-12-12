// modules
var childProcess = require('../lib/child-process');

// public
module.exports = bump;

// implementation
function bump(options) {
  return childProcess.exec('npm version ' + options.version + ' --no-git-tag-version --force')
    .then(function () {
      return options;
    });
}
