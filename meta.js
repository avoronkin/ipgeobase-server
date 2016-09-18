'use strict';
var methods = require('methods');

function isPatch(value) {
  return typeof meta === 'string';
}

function isHandler(value) {
  return typeof value === 'function' || Array.isArray(value);
}

function notMeta(value) {
  return isHandler(value) || isPatch(value);
}

module.exports = function(middlewares) {
  return function(config) {
    function middleware(req, res, next) {
      req.meta = config;
      next();
    }

    middleware.isMeta = true;
    middleware.config = config;

    if (Array.isArray(middlewares)) {
      middlewares.unshift(middleware)
    } else {
      middlewares = [middleware];
    }

    return middlewares
  };
};

module.exports.extend = function(app) {
  app._meta = app._meta || {};

  methods.forEach(function(method) {
    var _fn = app[method];
    app[method] = function(path) {
      var args = Array.prototype.slice.call(arguments, 0)
      var meta = args.find(function(arg) {
        if (Array.isArray(arg)) {
          return arg.find(function(_arg) {
            return _arg.isMeta;
          })
        }

        return arg.isMeta;
      })

      if (meta) {
        app._meta[method + ' ' + path] = meta.config || meta[0].config;
      }

      return _fn.apply(this, arguments);
    };
  });
};
