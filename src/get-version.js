// 3rd party modules
var crv = require('conventional-recommended-version');
var when = require('when');

// public
module.exports = getVersion;

// implementation
function getVersion(options) {
  if (options.overrideVersion) {
    options.version = options.overrideVersion;
    return when.resolve(options);
  }
  return when.promise(function (resolve, reject) {
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
