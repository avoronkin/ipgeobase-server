/* eslint consistent-return:0 */

const Joi = require('joi');
const boom = require('boom');

module.exports = function configureValidateMiddlevare () {
  return function validateMiddleware (req, res, next) {
    if (!req.meta || !req.meta.validate) return next();

    Joi.validate({
      query: req.query,
      path: req.params,
      body: req.body,
      headers: req.headers,
    }, req.meta.validate, {
      abortEarly: false,
      allowUnknown: true,
    }, (err) => {
      if (!err) return next();

      const errorDescriptions = err.details.map((detail) => {
        if (detail.path.indexOf('query.') > -1) {
          return `Get parameter ${detail.message}.`;
        } else if (detail.path.indexOf('body.') > -1) {
          return `Post parameter ${detail.message}.`;
        } else if (detail.path.indexOf('params.') > -1) {
          return `Url parameter ${detail.message}.`;
        } else if (detail.path.indexOf('headers.') > -1) {
          return `Header ${detail.message}.`;
        }
        return `${detail.message}.`;
      }).join(' ');

      next(boom.badRequest(errorDescriptions));
    });
  };
};
