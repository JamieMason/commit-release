// 3rd party modules
var fs = require('graceful-fs');
var whenNode = require('when/node');

// modules
var rateLimit = require('./rate-limit');

// public
module.exports = {
  createWriteStream: fs.createWriteStream,
  writeFile: wrap(fs.writeFile)
};

function wrap(fn) {
  return rateLimit(whenNode.lift(fn));
}
