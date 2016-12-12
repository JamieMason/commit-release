// modules
var exec = require('../exec');

// public
module.exports = commit;

// implementation
function commit(options) {
  return exec.shell('git', ['commit', '-m', 'chore(release): ' + options.version, options.noVerify ? '--no-verify' : '']).then(function () {
    return options;
  });
}
