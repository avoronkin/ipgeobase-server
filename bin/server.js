#!/usr/bin/env node
/* eslint no-console: 0 */
const finalhandler = require('finalhandler');
const http = require('http');
const app = require('../app');

const PORT = process.env.PORT || 8888;

http.ServerResponse.prototype.status = function status (code) {
  if (code) {
    this.statusCode = code;
  }
};

http.ServerResponse.prototype.text = function resText (data) {
  this.setHeader('Content-Type', 'text/plain; charset=utf-8');
  this.end(data);
};

http.ServerResponse.prototype.json = function resJson (data) {
  this.setHeader('Content-Type', 'application/json; charset=utf-8');
  this.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  app(req, res, finalhandler(req, res));
});

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`server listening on port ${PORT}`);
  }
});
