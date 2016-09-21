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
    var parameters = []
    if (meta.validate) {
      _.each(meta.validate, function(params, place) {
        if (place === 'body') {
          console.dir(params, {
            depth: 10
          })

          if (params.isJoi) {
            if (params._type === 'object') {
              var bodySchema = {
                type: 'object',
                description: _.get(params, '_description', ''),
                required: [],
                properties: {}
              };

              _.each(_.get(params, '_inner.children'), function(item) {
                var property = {
                  type: _.get(item, 'schema._type'),
                  description: _.get(item, 'schema._description', ''),
                }

                property.default = _.get(item, 'schema._flags.default', undefined);

                var required = _.get(item, 'schema._flags.presence') === 'required';
                if (required) {
                  bodySchema.required.push(item.key);
                }

                var valids = _.get(item, 'schema._valids._set');
                if (valids && valids.length) {
                  property.enum = valids;
                }

                _.set(bodySchema, 'properties.' + item.key, property);
              })
            }

          } else {
            var bodySchema = {
              type: 'object',
              required: [],
              properties: {}
            };

            _.each(params, function(value, key) {
              _.set(bodySchema, 'properties.' + key, {
                type: value._type,
                description: _.get(value, '_description', '')
              });

              if (_.get(value, '_flags.presence') === 'required') {
                bodySchema.required.push(key);
              }
            });
          }

          parameters.push({
            in: 'body',
            schema: bodySchema
          });

        } else if (place === 'query' || place === 'path') {
          _.each(params, function(value, key) {
            // console.dir(value, {
            //   depth: 10
            // })
            parameters.push({
              name: key,
              in: place,
              type: value._type,
              required: _.get(value, '_flags.presence') === 'required',
              description: _.get(value, '_description', '')
            })
          })

        }
      })
    }

    paths[meta.path] = paths[meta.path] || {}
    paths[meta.path][meta.method] = {
      description: meta.description,
      operationId: meta.operationId,
      produces: meta.produces || ['application/json'],
      parameters: parameters
    }
  })

  return paths
}
