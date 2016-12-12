// modules
var childProcess = require('../lib/child-process');

// public
module.exports = stage;

// implementation
function stage(options) {
  return childProcess.exec('git add . -A').then(function () {
    return options;
  });
}
