// node modules
var path = require('path');

// public
module.exports = checkVersion;

// implementation
function checkVersion(options) {
  return new Promise(function (resolve, reject) {
    var pkgPath = path.resolve(options.directory, 'package.json');
    var pkg = require(pkgPath); // eslint-disable-line import/no-dynamic-require
    if (options.version === pkg.version) {
      var err = new Error('Current version is already ' + options.version);
      reject(err);
    } else {
      resolve(options);
    }
  });
}
