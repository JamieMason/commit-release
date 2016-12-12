// modules
var childProcess = require('../lib/child-process');

// public
module.exports = commit;

// implementation
function commit(options) {
  var baseArgs = ['commit', '-m', 'chore(release): ' + options.version];
  var args = options.noVerify ? baseArgs.concat('--no-verify') : baseArgs;
  return childProcess.spawn('git', args).then(function () {
    return options;
  });
}
