// modules
var childProcess = require('./lib/child-process');

// public
module.exports = checkTagExists;

// implementation
function checkTagExists(options) {
  if (!options.force) {
    return childProcess.exec('git tag --list ' + options.version)
      .then(function (output) {
        if (output.trim() !== '') {
          return Promise.reject('A tag with name "' + options.version + '" already exists.');
        }
        return options;
      });
  }
  return options;
}
