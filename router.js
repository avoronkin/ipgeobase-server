'use strict';

var geo = require('geotools');
var version = require('./middleware/version');
var validator = require('./middleware/validator');
var Joi = require('joi');
var Router = require('router');

var Meta = require('./meta')
var meta = Meta([
  function(req, res, next) {
    if (req.meta.version) {
      var version = req.version = (req.params.version || req.query.version) || '1';
      var versions = req.meta.version.split(',')

      if (versions.indexOf(version) === -1) {
        return next('route');
      }
    }

    next()
  },
  function(req, res, next) {
    if (req.meta.validate) {
      var obj = {
        query: req.query,
        params: req.params,
        body: req.body
      };

      Joi.validate(obj, req.meta.validate, {
        abortEarly: false,
        allowUnknown: true
      }, function(err) {
        if (err) {
          return next(err);
        }
        return next();
      });

    }

    next()
  }
])

var router = module.exports = Router({
  mergeParams: true
});
Meta.extend(router)

var reqSchema = {
  query: {
    ip: Joi.string().required().ip({
      version: ['ipv4']
    })
  }
};

router.get(':ip',
  meta({
    name: 'ip',
    description: 'geolocation by ip',
    validate: reqSchema,
    version: '1,2'
  }),
  function(req, res, next) {
    var ip = req.query.ip;
    var result = geo.lookup(ip);

    res.json(result);
  });
