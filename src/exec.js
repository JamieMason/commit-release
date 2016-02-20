// 3rd party modules
var childProcess = require('child_process');

// public
module.exports = {
    shell: execShell
};

// implementation
function execShell(command) {
    return new Promise(function(resolve, reject) {
        childProcess.exec(command, function(error, stdout) {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}
