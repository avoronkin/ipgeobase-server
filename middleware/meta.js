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

      if (meta) {
        _meta[method + ' ' + path] = meta.config;
      }
      console.log('_meta', _meta)

      return _fn.apply(this, arguments);
    };
  });

  app.getMeta = function() {
    return _meta;
  }
};
