'use strict';
var geo = require('geotools');
var Router = require('router');
var qs = require('qs');

var router = module.exports = Router();

router.use(function(req, res, next) {
  var query = req._parsedUrl && req._parsedUrl.query;
  req.query = qs.parse(query);

  next();
});

router.get('/', function(req, res, next) {
  var ip = req.query.ip;
  var result = geo.lookup(ip);

  res.json(result);
});

router.use('*', function(req, res) {
  res.statusCode = 404;
  res.text('Not found');
});

router.use(function(err, req, res, next) {
  console.error(err);
  console.error(err.stack);

  res.statusCode = 500;
  res.text('Internal Server Error');
});
