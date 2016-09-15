'use strict';

var geo = require('geotools');
var version = require('./middleware/version');
var validator = require('./middleware/validator');
var Joi = require('joi');
var Router = require('router')

var router = module.exports = Router({
  mergeParams: true
});

var reqSchema = {
  query: {
    ip: Joi.string().required().ip({
      version: ['ipv4']
    })
  }
};

router.get('/', version('1'), validator(reqSchema), function(req, res, next) {
  var ip = req.query.ip;
  var result = geo.lookup(ip);

  res.json(result);
});
