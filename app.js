'use strict';

var errorHandler = require('./middleware/errorHandler');
var error404 = require('./middleware/error404');
var queryParser = require('./middleware/queryParser');
var router = require('./router');

var app = module.exports = require('router')();

app.use(queryParser())

app.use('/:version?/', router);

app.use('*', error404);

app.use(errorHandler);
