'use strict';
var methods = require('methods');
var _ = require('lodash')
var _meta = {}

module.exports.middleware = function(config) {
  function middleware(req, res, next) {
    req.meta = config;
    next();
  }

  middleware.isMeta = true;
  middleware.config = config;

  return middleware;
};

module.exports.extend = function(app) {
  methods.forEach(function(method) {
    var _fn = app[method];
    app[method] = function(path) {
      var args = Array.prototype.slice.call(arguments, 0)
      var meta = _.chain(args).flattenDeep().find({
        isMeta: true
      }).value()

      var operationId = _.get(meta, 'config.operationId')

      if (operationId) {
        meta.config.method = method;
        _meta[operationId] = meta.config;
      }

      return _fn.apply(this, arguments);
    };
  });

  app.getMeta = function() {
    return _meta;
  };

};


module.exports.getSpec = function() {
  var paths = {}
  _.each(_meta, function(meta) {
    var parametrs = []
    if (meta.validate) {
      _.each(meta.validate, function(params, place) {
        _.each(params, function(value, key) {
          console.dir(value, {
            depth: 10
          })
          parametrs.push({
            name: key,
            in: place,
            type: value._type,
            required: _.get(value, '_flags.presence') === 'required',
            description: _.get(value, '_description', '')
          })
        })
      })
    }

    paths[meta.path] = paths[meta.path] || {}
    paths[meta.path][meta.method] = {
      description: meta.description,
      operationId: meta.operationId,
      produces: meta.produces || ['application/json'],
      parametrs: parametrs
    }
  })

  return paths
}
