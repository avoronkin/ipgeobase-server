'use strict';
var Router = require('router');

var router = module.exports = Router({
  mergeParams: true
});

router.use('/:version?/ip', require('./ip'))
router.use('/:version?/test', require('./test'))
router.use('/docs', require('./docs'))
