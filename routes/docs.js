const routerFactory = require('../Router');
const version = require('../middleware/version');
// const validate = require('../middleware/validate');
const meta = require('../middleware/meta');

const metaMiddleware = meta.middleware;
const getSpec = meta.getSpec;
const router = module.exports = routerFactory();

router.get('/',
  metaMiddleware({
    operationId: 'docs',
    path: '/docs',
    description: 'docs',
    version: '1,2',
  }),
  version(),
  (req, res) => {
    res.json({
      swagger: '2.0',
      info: {
        title: 'Simple API overview',
        version: '2',
      },
      host: 'localhost:8888',
      basePath: '/2',
      paths: getSpec(),
    });
  });
