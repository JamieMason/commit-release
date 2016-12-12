// modules
var exec = require('./exec');

// public
module.exports = checkTagExists;

// implementation
function checkTagExists(options) {
  if (!options.force) {
    return exec.shell('git', ['tag', '--list', options.version])
      .then(function (output) {
        if (output.trim() !== '') {
          return Promise.reject('A tag with name "' + options.version + '" already exists.');
        }
        return options;
      });
  }
  return options;
}
