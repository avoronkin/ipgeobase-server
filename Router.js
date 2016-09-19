'use strict';
var Router = require('router');
var meta = require('./middleware/meta')

module.exports = function() {
  var router = Router({
    mergeParams: true
  });

  meta.extend(router)

  return router
}
