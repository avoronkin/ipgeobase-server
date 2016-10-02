
const routerFactory = require('../Router');

const router = module.exports = routerFactory();

const router2 = routerFactory();

router2.use('/test', require('./test'));

router2.use('/ip', require('./ip'));

router.use('/:version?', router2);

// router.use('/:version?/test', require('./test'))
router.use('/docs', require('./docs'));
