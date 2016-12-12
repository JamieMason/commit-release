// 3rd party modules
var crv = require('conventional-recommended-version');

// public
module.exports = getVersion;

// implementation
function getVersion(options) {
  if (options.overrideVersion) {
    options.version = options.overrideVersion;
    return Promise.resolve(options);
  }
  return new Promise(function (resolve, reject) {
    crv.get(options, function (err, version) {
      if (err) {
        reject(err);
      } else {
        options.version = version;
        resolve(options);
      }
    });
  });
}
