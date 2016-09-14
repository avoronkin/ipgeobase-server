'use strict';
var Joi = require('joi');

module.exports = function(schema) {
  return function(req, res, next) {
    var obj = {
      query: req.query,
      params: req.params,
      body: req.body
    };

    Joi.validate(obj, schema, {
      abortEarly: false,
      allowUnknown: true
    }, function(err) {
      if (err) {
        return next(err);
      }
      next();
    });

  };
};
