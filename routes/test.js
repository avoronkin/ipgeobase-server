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
    version: '2',
  }),
  version(),
  function(req, res, next) {
    res.json({
      test: true
    });
  });

var reqSchema = {
  body: Joi.object()
    .description('dbshdbshdb description')
    .keys({
      ip: Joi.string().required().description('ip param description'),
      test: Joi.string()
        .description('test param description')
        .default('a')
        .valid('b', 'B', 'a', 'd')
    }),
  path: {
    id: Joi.string()
      .required()
      .description('ID of pet to use')
  }
};

router.post('/:id',
  meta({
    operationId: 'createTest',
    path: '/test/{id}',
    description: 'create test description',
    validate: reqSchema,
    version: '2'
  }),
  version(),
  function(req, res, next) {
    res.json({
      test: true
    });
  });
