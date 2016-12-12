// node modules
var fs = require('fs');
var path = require('path');

// 3rd party modules
var changelog = require('conventional-changelog');

// public
module.exports = updateChangeLog;

// implementation
function updateChangeLog(options) {
  return new Promise(function (resolve, reject) {
    var writeStream = fs.createWriteStream(
      path.resolve(options.directory, 'CHANGELOG.md')
    );

    writeStream.on('finish', onWriteEnd);

    changelog({
      path: options.directory,
      preset: 'angular',
      releaseCount: 0
    }).pipe(writeStream);

    function onWriteEnd(err) {
      if (err) {
        reject(err);
      } else {
        resolve(options);
      }
    }
  });
}
