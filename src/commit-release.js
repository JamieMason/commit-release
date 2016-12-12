// modules
var checkTagExists = require('./check-tag-exists');
var createCommit = require('./create-commit');
var getVersion = require('./get-version');

// public
module.exports = commitRelease;

// implementation
function commitRelease(options, done) {
  getVersion(options)
    .then(checkTagExists)
    .then(createCommit)
    .then(onSuccess, onError)
    .catch(onError);

  function onSuccess() {
    done(null, options);
  }

  function onError(message) {
    done(message);
  }
}
