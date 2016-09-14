'use strict';

module.exports = function() {
  var versions = Array.prototype.slice.call(arguments);

  return function(req, res, next) {
    req.version = (req.params.version || req.query.version) || '1'

    if (versions.indexOf(req.version) > -1) {
      next()
    } else {
      next('route')
    }
  }
}
