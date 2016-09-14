'use strict';
var boom = require('boom')

module.exports = function(req, res, next) {
  next(boom.notFound('Not found'));
};
