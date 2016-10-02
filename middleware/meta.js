/* eslint no-param-reassign: 0, no-underscore-dangle: 0 */
const methods = require('methods');
const _ = require('lodash');

const _meta = {};

module.exports.middleware = function configureMetaMiddleware (config) {
  function metaMiddleware (req, res, next) {
    req.meta = config;
    next();
  }

  metaMiddleware.isMeta = true;
  metaMiddleware.config = config;

  return metaMiddleware;
};

module.exports.extend = function extend (app) {
  methods.forEach((method) => {
    const _fn = app[method];
    app[method] = function handler (...args) {
    //   const args = Array.prototype.slice.call(arguments, 0);
      const meta = _.chain(args).flattenDeep().find({
        isMeta: true,
      }).value();

      const operationId = _.get(meta, 'config.operationId');

      if (operationId) {
        meta.config.method = method;
        _meta[operationId] = meta.config;
      }

      return _fn.apply(this, args);
    };
  });

  app.getMeta = function getMeta () {
    return _meta;
  };
};


module.exports.getSpec = function getSpec () {
  const paths = {};

  _.each(_meta, (meta) => {
    const parameters = [];
    if (meta.validate) {
      _.each(meta.validate, (params, place) => {
        let bodySchema = {};

        if (place === 'body') {
          if (params.isJoi) {
            if (params._type === 'object') {
              bodySchema = {
                type: 'object',
                description: _.get(params, '_description', ''),
                required: [],
                properties: {},
              };

              _.each(_.get(params, '_inner.children'), (item) => {
                const property = {
                  type: _.get(item, 'schema._type'),
                  description: _.get(item, 'schema._description', ''),
                };

                property.default = _.get(item, 'schema._flags.default', undefined);

                const required = _.get(item, 'schema._flags.presence') === 'required';
                if (required) {
                  bodySchema.required.push(item.key);
                }

                const valids = _.get(item, 'schema._valids._set');
                if (valids && valids.length) {
                  property.enum = valids;
                }

                _.set(bodySchema, `properties.${item.key}`, property);
              });
            }
          } else {
            bodySchema = {
              type: 'object',
              required: [],
              properties: {},
            };

            _.each(params, (value, key) => {
              _.set(bodySchema, `properties.${key}`, {
                type: value._type,
                description: _.get(value, '_description', ''),
              });

              if (_.get(value, '_flags.presence') === 'required') {
                bodySchema.required.push(key);
              }
            });
          }

          parameters.push({
            in: 'body',
            schema: bodySchema,
          });
        } else if (place === 'query' || place === 'path') {
          _.each(params, (value, key) => {
            // console.dir(value, {
            //   depth: 10
            // })
            parameters.push({
              name: key,
              in: place,
              type: value._type,
              required: _.get(value, '_flags.presence') === 'required',
              description: _.get(value, '_description', ''),
            });
          });
        }
      });
    }

    paths[meta.path] = paths[meta.path] || {};
    paths[meta.path][meta.method] = {
      description: meta.description,
      operationId: meta.operationId,
      produces: meta.produces || ['application/json'],
      parameters,
    };
  });

  return paths;
};
