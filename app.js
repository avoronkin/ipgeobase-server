'use strict';

var errorHandler = require('./middleware/errorHandler');
var error404 = require('./middleware/error404');
var router = require('./router')

var app = module.exports = require('express')();

app.use('/:version?/', router);

app.use('*', error404);

app.use(errorHandler);
