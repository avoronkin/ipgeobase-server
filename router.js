'use strict';
var geo = require('geotools');
var Router = require('router');
var Joi = require('joi');

var version = require('./middleware/version');
var validator = require('./middleware/validator');
var errorHandler = require('./middleware/errorHandler');
var queryParser = require('./middleware/queryParser');
var error404 = require('./middleware/error404');

var router = module.exports = Router();

router.use(queryParser());

var reqSchema = {
  query: {
    ip: Joi.string().required().ip({
      version: ['ipv4']
    })
  }
};

router.get('/:version?/', version('1'), validator(reqSchema), function(req, res, next) {
  var ip = req.query.ip;
  var result = geo.lookup(ip);

  res.json(result);
});

router.use('*', error404);

router.use(errorHandler);
