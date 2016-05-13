// 3rd party modules
var chalk = require('chalk');
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
    var template = getLogTemplate(program, truthyArgs);
    var stderr = '';
    var stdout = '';

    proc.stdout.on('data', onStdout);
    proc.stderr.on('data', onStderr);
    proc.on('close', onClose);

    function onStdout (data) {
      console.log(template, data);
      stdout += data;
    }

    function onStderr (data) {
      console.log(template, data);
      stderr += data;
    }

    function onClose (code) {
      if (code === 1) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    }
  });
}

function isTruthy(value) {
  return !!value;
}

function getLogTemplate(program, args) {
  var command = [program].concat(args).join(' ');
  return chalk.grey('>> ' + command) + '\n%s';
}
