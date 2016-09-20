'use strict';
var Router = require('../Router');

var router = module.exports = Router();

var router2 = Router();

router.use('/:version?', router2)
router2.use('/ip', require('./ip'))
router2.use('/test', require('./test'))

// router.use('/:version?/test', require('./test'))
router.use('/docs', require('./docs'))
