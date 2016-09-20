'use strict';

var version = require('../middleware/version');
var validate = require('../middleware/validate');
var meta = require('../middleware/meta').middleware;
var Joi = require('joi');
var Router = require('../Router');

var router = module.exports = Router();

router.get('/',
  meta({
    operationId: 'readTest',
    path: '/test',
    description: 'read test description',
    version: '2'
  }),
  version(),
  function(req, res, next) {
    res.json({
      test: true
    });
  });

router.post('/',
  meta({
    operationId: 'createTest',
    path: '/test',
    description: 'create test description',
    version: '2'
  }),
  version(),
  function(req, res, next) {
    res.json({
      test: true
    });
  });
