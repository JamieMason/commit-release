// 3rd party modules
var childProcess = require('child_process');

// public
module.exports = {
  shell: execShell
};

// implementation
function execShell (program, args) {
  return new Promise(function (resolve, reject) {
    var truthyArgs = args.filter(isTruthy);
    var proc = childProcess.spawn(program, truthyArgs);
    var stderr = '';
    var stdout = '';

    proc.stdout.on('data', onStdout);
    proc.stderr.on('data', onStderr);
    proc.on('close', onClose);

    function onStdout (data) {
      stdout += data;
    }

    function onStderr (data) {
      stderr += data;
    }

    function onClose (code) {
      if (code === 1) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    }

    function isTruthy(value) {
      return !!value;
    }
  });
}
