'use strict';

var Joi = require('joi');

module.exports = function(schema) {
  return function(req, res, next) {
    if (req.meta.validate) {
      Joi.validate({
        query: req.query,
        params: req.params,
        body: req.body
      }, req.meta.validate, {
        abortEarly: false,
        allowUnknown: true
      }, function(err) {
        return next(err);
      });
    }

    next();
  };
};
