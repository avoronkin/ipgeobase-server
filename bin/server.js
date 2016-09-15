#!/usr/bin/env node
'use strict';
var finalhandler = require('finalhandler');
var http = require('http');
var app = require('../app');
var PORT = process.env.PORT || 8888;

http.ServerResponse.prototype.text = function(data) {
  this.setHeader('Content-Type', 'text/plain; charset=utf-8');
  this.end(data);
};

http.ServerResponse.prototype.json = function(data) {
  this.setHeader('Content-Type', 'application/json; charset=utf-8');
  this.end(JSON.stringify(data));
};

var server = http.createServer(function(req, res) {
  app(req, res, finalhandler(req, res));
});

server.listen(PORT, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('server listening on port ' + PORT);
  }
});
