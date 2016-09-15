'use strict';

var boom = require('boom');

module.exports = [function(err, req, res, next) {
  if (err.isBoom) {
    next(err);
  } else if (err.isJoi && err.details) {
    var error_descriptions = err.details.map(function(detail) {
      if (detail.path.indexOf('query.') > -1) {
        return 'Get parameter ' + detail.message + '.';
      } else if (detail.path.indexOf('body.') > -1) {
        return 'Post parameter ' + detail.message + '.';
      } else if (detail.path.indexOf('params.') > -1) {
        return 'Url parameter ' + detail.message + '.';
      } else {
        return detail.message + '.';
      }
    });

    next(boom.badRequest(error_descriptions));
  } else {
    next(boom.badImplementation());
  }
}, function(err, req, res, next) {
  if (err.isBoom) {
    res.statusCode = err.output.payload.statusCode;
    res.json({
      error: err.output.payload.error,
      message: err.output.payload.message,
    });
  } else {
    res.statusCode = 500;
    res.json({
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    });
  }
}];
