'use strict';

var geo = require('geotools');
var version = require('../middleware/version');
var validate = require('../middleware/validate');
var meta = require('../middleware/meta').middleware;
var Joi = require('joi');
var Router = require('../Router');

var router = module.exports = Router();

var reqSchema = {
  query: {
    ip: Joi
      .string()
      .required()
      .ip({
        version: ['ipv4']
      })
      .description('ip param description')
  }
};

router.get('/',
  meta({
    operationId: 'getLocationByIp',
    path: '/ip',
    description: 'geolocation by ip',
    validate: reqSchema,
    version: '1,2'
  }),
  version(),
  validate(),
  function(req, res, next) {
    var ip = req.query.ip;
    var result = geo.lookup(ip);

    res.json(result);
  });
