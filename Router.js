const routerFactory = require('router');
const meta = require('./middleware/meta');

module.exports = function rf () {
  const router = routerFactory({
    mergeParams: true,
  });

  meta.extend(router);

  return router;
};
