'use strict';

var errorHandler = require('./middleware/errorHandler');
var error404 = require('./middleware/error404');
var queryParser = require('./middleware/queryParser');
var router = require('./routes');
var cors = require('./middleware/cors');

var app = module.exports = require('./Router')();

app.use(queryParser())

app.use(cors());
app.use(router);

app.use('*', error404);

app.use(errorHandler);
