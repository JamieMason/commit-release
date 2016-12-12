// modules
var exec = require('../exec');

// public
module.exports = stage;

// implementation
function stage(options) {
  return exec.shell('git', ['add', '.', '-A']).then(function () {
    return options;
  });
}
