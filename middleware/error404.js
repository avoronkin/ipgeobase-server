const boom = require('boom');

module.exports = function error404Middleware (req, res, next) {
  next(boom.notFound('Not found'));
};
