'use strict';
var Router = require('../Router');
var version = require('../middleware/version');
var validate = require('../middleware/validate');

var meta = require('../middleware/meta').middleware;

var router = module.exports = Router();

router.get('/',
  meta({
    operationId: 'docs',
    path: '/docs',
    description: 'docs',
    version: '1,2'
  }),
  version(),
  function(req, res, next) {
    res.json({
      swagger: '2.0',
      info: {
        title: 'Simple API overview',
        version: '2'
      },
      host: 'localhost:8888',
      basePath: '/2',
      paths: require('../middleware/meta').getSpec()
    });
  });
