'use strict';

module.exports = function() {
  return function(req, res, next) {
    console.log('req meta', req.meta)
    if (req.meta.version) {
      var version = req.version = (req.params.version || req.query.version) || '1';
      var versions = req.meta.version.split(',')
      console.log(version, versions)

      if (versions.indexOf(version) + 1) {
        return next();
      } else {
        return next('route');
      }
    }

    next()
  };
};
