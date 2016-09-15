'use strict';
var qs = require('qs');

module.exports = function() {
  return function(req, res, next) {
    var query = req._parsedUrl && req._parsedUrl.query;
    req.query = qs.parse(query);

    next();
  };
};
